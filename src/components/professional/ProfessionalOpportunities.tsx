import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  urgency: string;
  budget: number;
  location: string;
  created_at: string;
  client_id: string;
  profiles?: {
    display_name?: string;
  };
}

export function ProfessionalOpportunities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);

  // Estado para o modal de proposta
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalDuration, setProposalDuration] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do profissional
      const { data: professionalData } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!professionalData) {
        navigate('/professional-registration');
        return;
      }

      setProfessional(professionalData);
      await loadAvailableRequests();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar oportunidades');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar solicitações:', error);
      return;
    }

    setAvailableRequests(data || []);
  };

  const handleSendProposal = async () => {
    if (!selectedRequest || !professional) return;

    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          service_request_id: selectedRequest.id,
          professional_id: professional.id,
          client_id: selectedRequest.client_id,
          price: parseFloat(proposalPrice),
          message: proposalMessage,
          estimated_duration: parseInt(proposalDuration)
        });

      if (error) throw error;

      // Atualizar status da solicitação
      await supabase
        .from('service_requests')
        .update({ status: 'proposta_enviada' })
        .eq('id', selectedRequest.id);

      toast.success('Proposta enviada com sucesso!');
      
      // Resetar formulário
      setSelectedRequest(null);
      setProposalPrice('');
      setProposalMessage('');
      setProposalDuration('');
      
      // Recarregar dados
      loadData();

    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      toast.error('Erro ao enviar proposta. Tente novamente.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pendente' },
      proposta_enviada: { variant: 'default' as const, label: 'Proposta Enviada' },
      contratado: { variant: 'default' as const, label: 'Contratado' },
      em_execucao: { variant: 'default' as const, label: 'Em Execução' },
      completed: { variant: 'default' as const, label: 'Concluído' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">
          Encontre projetos e envie suas propostas
        </p>
      </div>

      {availableRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Não há oportunidades disponíveis no momento.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {availableRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  {getStatusBadge(request.status)}
                </div>
                <CardDescription>
                  {request.profiles?.display_name} • {request.location} • 
                  {new Date(request.created_at).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {request.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    AOA {request.budget?.toLocaleString('pt-BR')}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/conversation/${request.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Proposta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Proposta</DialogTitle>
                          <DialogDescription>
                            Envie sua proposta para: {request.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="price">Preço (AOA)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={proposalPrice}
                              onChange={(e) => setProposalPrice(e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Duração estimada (dias)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={proposalDuration}
                              onChange={(e) => setProposalDuration(e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Mensagem</Label>
                            <Textarea
                              id="message"
                              value={proposalMessage}
                              onChange={(e) => setProposalMessage(e.target.value)}
                              placeholder="Descreva sua proposta e experiência..."
                              rows={4}
                            />
                          </div>
                          <Button 
                            onClick={handleSendProposal}
                            className="w-full"
                            disabled={!proposalPrice || !proposalMessage || !proposalDuration}
                          >
                            Enviar Proposta
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}