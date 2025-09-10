import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [proposalForm, setProposalForm] = useState({
    price: '',
    message: '',
    estimated_duration: ''
  });

  useEffect(() => {
    if (!isProfessional) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, isProfessional]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Buscar dados do profissional
      const { data: professionalData } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!professionalData) {
        toast.error('Perfil profissional não encontrado. Complete seu cadastro primeiro.');
        navigate('/professional-registration');
        return;
      }

      setProfessional(professionalData);

      // Buscar solicitações disponíveis (sem profissional atribuído)
      const { data: requests } = await supabase
        .from('service_requests')
        .select(`
          *,
          profiles:client_id (display_name)
        `)
        .eq('status', 'pending')
        .is('professional_id', null);

      setAvailableRequests(requests as ServiceRequest[] || []);

      // Buscar minhas propostas
      const { data: proposals } = await supabase
        .from('proposals')
        .select(`
          *,
          service_requests (
            id, title, description, status, urgency, budget, location, created_at,
            profiles:client_id (display_name)
          )
        `)
        .eq('professional_id', professionalData.id);

      setMyProposals((proposals as any) || []);

      // Buscar trabalhos ativos (onde sou o profissional)
      const { data: jobs } = await supabase
        .from('service_requests')
        .select(`
          *,
          profiles:client_id (display_name)
        `)
        .eq('professional_id', professionalData.id)
        .in('status', ['contratado', 'em_execucao']);

      setActiveJobs(jobs as ServiceRequest[] || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
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
          price: parseFloat(proposalForm.price),
          message: proposalForm.message,
          estimated_duration: parseInt(proposalForm.estimated_duration)
        });

      if (error) throw error;

      // Atualizar status da solicitação
      await supabase
        .from('service_requests')
        .update({ status: 'proposta_enviada' })
        .eq('id', selectedRequest.id);

      toast.success('Proposta enviada com sucesso!');
      setSelectedRequest(null);
      setProposalForm({ price: '', message: '', estimated_duration: '' });
      loadData();
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      toast.error('Erro ao enviar proposta');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      proposta_enviada: { label: 'Proposta Enviada', variant: 'default' as const },
      contratado: { label: 'Contratado', variant: 'outline' as const },
      em_execucao: { label: 'Em Execução', variant: 'default' as const },
      completed: { label: 'Concluído', variant: 'outline' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProposalStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Aguardando', variant: 'secondary' as const, icon: Clock },
      accepted: { label: 'Aceita', variant: 'outline' as const, icon: CheckCircle },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const, icon: XCircle },
      withdrawn: { label: 'Retirada', variant: 'outline' as const, icon: XCircle }
    };
    
    const statusInfo = config[status as keyof typeof config] || config.pending;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Profissional</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {professional?.name}! Gerencie suas oportunidades e trabalhos.
          </p>
        </div>

        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="opportunities">
              Oportunidades ({availableRequests.length})
            </TabsTrigger>
            <TabsTrigger value="proposals">
              Minhas Propostas ({myProposals.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Trabalhos Ativos ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="profile">
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <CardDescription>
                      Por: {request.profiles?.display_name || 'Cliente'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {request.description}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Orçamento: R$ {request.budget}</span>
                      <Badge variant="outline">{request.urgency}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{request.location}</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{request.title}</DialogTitle>
                            <DialogDescription>
                              Solicitação de {request.profiles?.display_name || 'Cliente'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Descrição:</h4>
                              <p className="text-sm text-muted-foreground">{request.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Orçamento:</span>
                                <p>R$ {request.budget}</p>
                              </div>
                              <div>
                                <span className="font-medium">Urgência:</span>
                                <p>{request.urgency}</p>
                              </div>
                              <div>
                                <span className="font-medium">Local:</span>
                                <p>{request.location}</p>
                              </div>
                              <div>
                                <span className="font-medium">Data:</span>
                                <p>{new Date(request.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedRequest(request)}
                        className="flex-1"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Proposta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {availableRequests.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhuma oportunidade disponível no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-4">
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
                      Proposta enviada em {new Date(proposal.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Valor Proposto:</span>
                        <p>R$ {proposal.price}</p>
                      </div>
                      <div>
                        <span className="font-medium">Duração Estimada:</span>
                        <p>{proposal.estimated_duration}h</p>
                      </div>
                      <div>
                        <span className="font-medium">Cliente:</span>
                        <p>{proposal.service_requests?.profiles?.display_name || 'Cliente'}</p>
                      </div>
                    </div>
                    {proposal.message && (
                      <div>
                        <span className="font-medium text-sm">Mensagem:</span>
                        <p className="text-sm text-muted-foreground mt-1">{proposal.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {myProposals.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Você ainda não enviou nenhuma proposta.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription>
                      Cliente: {job.profiles?.display_name || 'Cliente'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Orçamento: R$ {job.budget}</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/conversation/${job.id}`)}
                      >
                        Ver Conversa
                      </Button>
                      {job.status === 'contratado' && (
                        <Button 
                          size="sm"
                          onClick={async () => {
                            try {
                              await supabase
                                .from('service_requests')
                                .update({ status: 'em_execucao' })
                                .eq('id', job.id);
                              toast.success('Status atualizado para "Em Execução"');
                              loadData();
                            } catch (error) {
                              toast.error('Erro ao atualizar status');
                            }
                          }}
                        >
                          Iniciar Trabalho
                        </Button>
                      )}
                      {job.status === 'em_execucao' && (
                        <Button 
                          size="sm"
                          onClick={async () => {
                            try {
                              await supabase
                                .from('service_requests')
                                .update({ 
                                  status: 'completed',
                                  completed_at: new Date().toISOString()
                                })
                                .eq('id', job.id);
                              toast.success('Trabalho marcado como concluído!');
                              loadData();
                            } catch (error) {
                              toast.error('Erro ao concluir trabalho');
                            }
                          }}
                        >
                          Marcar como Concluído
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {activeJobs.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Você não tem trabalhos ativos no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil Profissional</CardTitle>
                <CardDescription>
                  Informações do seu perfil profissional
                </CardDescription>
              </CardHeader>
              {professional && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <p className="text-sm font-medium">{professional.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm font-medium">{professional.email}</p>
                    </div>
                    <div>
                      <Label>Profissão</Label>
                      <p className="text-sm font-medium">{professional.profession}</p>
                    </div>
                    <div>
                      <Label>Valor por Hora</Label>
                      <p className="text-sm font-medium">R$ {professional.hourly_rate}</p>
                    </div>
                    <div>
                      <Label>Avaliação</Label>
                      <p className="text-sm font-medium">
                        {professional.rating || 'Sem avaliações'} 
                        {professional.total_reviews > 0 && ` (${professional.total_reviews} avaliações)`}
                      </p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge variant={professional.is_available ? 'outline' : 'secondary'}>
                        {professional.is_available ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Descrição dos Serviços</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {professional.description || 'Nenhuma descrição cadastrada'}
                    </p>
                  </div>
                  <div>
                    <Label>Localização</Label>
                    <p className="text-sm text-muted-foreground">
                      {professional.location || 'Não informado'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/professional-registration')}
                  >
                    Editar Perfil
                  </Button>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para enviar proposta */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Proposta</DialogTitle>
              <DialogDescription>
                {selectedRequest?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Valor da Proposta (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={proposalForm.price}
                  onChange={(e) => setProposalForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração Estimada (horas)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={proposalForm.estimated_duration}
                  onChange={(e) => setProposalForm(prev => ({ ...prev, estimated_duration: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="message">Mensagem para o Cliente</Label>
                <Textarea
                  id="message"
                  value={proposalForm.message}
                  onChange={(e) => setProposalForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Descreva como você pode ajudar com este projeto..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSendProposal}
                  className="flex-1"
                  disabled={!proposalForm.price || !proposalForm.estimated_duration}
                >
                  Enviar Proposta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalDashboard;