import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock,
  Search,
  Plus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Conversation {
  id: string;
  created_at: string;
  service_requests?: {
    title: string;
    client_name?: string;
    professional_name?: string;
  };
  messages?: Message[];
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_admin_message: boolean;
  sender_name?: string;
}

const ConversationsManagement = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Buscar dados relacionados separadamente
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conversation) => {
          const { data: serviceRequest } = await supabase
            .from('service_requests')
            .select('title, client_id, professional_id')
            .eq('id', conversation.service_request_id)
            .single();

          let clientName = 'Cliente';
          let professionalName = '';

          if (serviceRequest) {
            // Buscar nome do cliente
            const { data: clientProfile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', serviceRequest.client_id)
              .single();

            if (clientProfile) {
              clientName = clientProfile.display_name || 'Cliente';
            }

            // Buscar nome do profissional
            if (serviceRequest.professional_id) {
              const { data: professional } = await supabase
                .from('professionals')
                .select('name')
                .eq('id', serviceRequest.professional_id)
                .single();

              if (professional) {
                professionalName = professional.name;
              }
            }
          }

          return {
            ...conversation,
            service_requests: {
              title: serviceRequest?.title || 'Conversa',
              client_name: clientName,
              professional_name: professionalName
            },
            messages: []
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast.error('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Buscar nomes dos remetentes
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (message) => {
          let senderName = 'Usuário';
          
          if (message.is_admin_message) {
            senderName = 'Admin';
          } else {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', message.sender_id)
              .single();
            
            if (profile) {
              senderName = profile.display_name || 'Usuário';
            }
          }

          return {
            ...message,
            sender_name: senderName
          };
        })
      );
      
      setSelectedConversation(prev => 
        prev ? { ...prev, messages: messagesWithSenders } : null
      );
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const sendAdminMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      setSendingMessage(true);
      
      // Simular ID de admin (em uma implementação real, seria do usuário logado como admin)
      const adminUserId = '00000000-0000-0000-0000-000000000000'; // UUID fictício para admin
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: adminUserId,
          content: newMessage,
          is_admin_message: true,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage("");
      await fetchMessages(selectedConversation.id);
      toast.success('Mensagem enviada como admin');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSendingMessage(false);
    }
  };

  const openConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.id);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.service_requests?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.service_requests?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.service_requests?.professional_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Conversas</CardTitle>
          <CardDescription>Carregando conversas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversas Ativas</CardTitle>
          <CardDescription>
            Acompanhe e participe das conversas entre clientes e profissionais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => openConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {conversation.service_requests?.title || 'Conversa sem título'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <User className="h-3 w-3" />
                      <span>{conversation.service_requests?.client_name}</span>
                      {conversation.service_requests?.professional_name && (
                        <>
                          <span>•</span>
                          <span>{conversation.service_requests.professional_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(conversation.created_at), 'dd/MM', { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma conversa encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedConversation ? 'Participar da Conversa' : 'Selecione uma Conversa'}
          </CardTitle>
          <CardDescription>
            {selectedConversation 
              ? `Conversa sobre: ${selectedConversation.service_requests?.title}`
              : 'Escolha uma conversa para visualizar as mensagens e participar.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedConversation ? (
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-3 p-4 border rounded-lg bg-muted/20">
                {selectedConversation.messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_admin_message ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.is_admin_message
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>
                          {message.sender_name || 'Usuário'}
                        </span>
                        <span>
                          {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Responder como Admin</Label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite sua mensagem como administrador..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button
                    onClick={sendAdminMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione uma conversa para visualizar as mensagens e participar da discussão.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationsManagement;