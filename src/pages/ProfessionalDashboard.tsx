import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
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

interface Proposal {
  id: string;
  service_request_id: string;
  price: number;
  message: string;
  estimated_duration: number;
  status: string;
  created_at: string;
  service_requests?: ServiceRequest;
}

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const { isProfessional } = useRole();
  const navigate = useNavigate();
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [myProposals, setMyProposals] = useState<Proposal[]>([]);
  const [activeJobs, setActiveJobs] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);

  // Estado para o modal de proposta
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalDuration, setProposalDuration] = useState('');

  useEffect(() => {
    if (user && isProfessional) {
      loadData();
    } else if (!isProfessional) {
      navigate('/dashboard');
    }
  }, [user, isProfessional, navigate]);

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

      // Carregar solicitações disponíveis, propostas e trabalhos ativos
      await Promise.all([
        loadAvailableRequests(),
        loadMyProposals(professionalData.id),
        loadActiveJobs(professionalData.id)
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
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

  const loadMyProposals = async (professionalId: string) => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar propostas:', error);
      return;
    }

    setMyProposals(data || []);
  };

  const loadActiveJobs = async (professionalId: string) => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('professional_id', professionalId)
      .in('status', ['contratado', 'em_execucao'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar trabalhos ativos:', error);
      return;
    }

    setActiveJobs(data || []);
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

  const getProposalStatusBadge = (status: string) => {
    const icons = {
      pending: <Clock className="h-3 w-3" />,
      accepted: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />
    };

    const labels = {
      pending: 'Pendente',
      accepted: 'Aceita',
      rejected: 'Rejeitada'
    };

    return (
      <Badge variant={status === 'accepted' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </Badge>
    );
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
      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">
            Oportunidades ({availableRequests.length})
          </TabsTrigger>
          <TabsTrigger value="proposals">
            Minhas Propostas ({myProposals.length})
          </TabsTrigger>
          <TabsTrigger value="jobs">
            Trabalhos Ativos ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="profile">
            Meu Perfil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4 mt-6">
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
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4 mt-6">
          {myProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Você ainda não enviou propostas.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myProposals.map((proposal) => (
                <Card key={proposal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {proposal.service_requests?.title}
                      </CardTitle>
                      {getProposalStatusBadge(proposal.status)}
                    </div>
                    <CardDescription>
                      Enviado em {new Date(proposal.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {proposal.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                          AOA {proposal.price?.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {proposal.estimated_duration} dias
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/conversation/${proposal.service_request_id}`)}
                      >
                        Ver Conversa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4 mt-6">
          {activeJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Você não tem trabalhos ativos no momento.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription>
                      Cliente: {job.profiles?.display_name} • {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {job.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        AOA {job.budget?.toLocaleString('pt-BR')}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/conversation/${job.id}`)}
                        >
                          Conversar
                        </Button>
                        <Button 
                          size="sm"
                          variant={job.status === 'contratado' ? 'default' : 'secondary'}
                        >
                          {job.status === 'contratado' ? 'Iniciar Trabalho' : 'Finalizar'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil Profissional</CardTitle>
              <CardDescription>
                Gerencie suas informações profissionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {professional ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nome</Label>
                      <p className="text-sm text-muted-foreground">{professional.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Profissão</Label>
                      <p className="text-sm text-muted-foreground">{professional.profession}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">{professional.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Telefone</Label>
                      <p className="text-sm text-muted-foreground">{professional.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Localização</Label>
                      <p className="text-sm text-muted-foreground">{professional.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valor por hora</Label>
                      <p className="text-sm text-muted-foreground">
                        AOA {professional.hourly_rate?.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Descrição</Label>
                    <p className="text-sm text-muted-foreground">{professional.description}</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/professional-registration')}
                    className="mt-4"
                  >
                    Editar Perfil
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Complete seu perfil profissional
                  </p>
                  <Button onClick={() => navigate('/professional-registration')}>
                    Completar Perfil
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalDashboard;