import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  is_admin_message: boolean;
  created_at: string;
}

interface ConversationData {
  id: string;
  service_request_id: string;
  participant_ids: string[];
}

const Conversation = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requestId && user) {
      loadConversation();
    }
  }, [requestId, user]);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      subscribeToMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('service_request_id', requestId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConversation(data);
      } else {
        // Criar conversa se não existir
        await createConversation();
      }
    } catch (error: any) {
      console.error('Erro ao carregar conversa:', error);
      toast.error('Erro ao carregar conversa');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          service_request_id: requestId,
          participant_ids: [user?.id]
        })
        .select()
        .single();

      if (error) throw error;

      setConversation(data);
    } catch (error: any) {
      console.error('Erro ao criar conversa:', error);
      toast.error('Erro ao criar conversa');
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation?.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversation || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: newMessage.trim(),
          sender_id: user.id
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const isMyMessage = (senderId: string) => senderId === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Carregando conversa...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Conversa - Solicitação #{requestId}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage(message.sender_id) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        isMyMessage(message.sender_id)
                          ? 'bg-primary text-primary-foreground'
                          : message.is_admin_message
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.is_admin_message && (
                        <div className="text-xs font-semibold mb-1">Admin</div>
                      )}
                      <p>{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  Enviar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Conversation;