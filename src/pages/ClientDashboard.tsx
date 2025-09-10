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
import { ProposalCard } from '@/components/ProposalCard';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  urgency: string;
  budget: number;
  location: string;
  created_at: string;
  professional_id?: string;
  profiles?: {
    display_name?: string;
  };
}

interface Proposal {
  id: string;
  service_request_id: string;
  professional_id: string;
  price: number;
  message: string;
  estimated_duration: number;
  status: string;
  created_at: string;
  professionals?: {
    name?: string;
    email?: string;
    profession?: string;
    rating?: number;
    total_reviews?: number;
    hourly_rate?: number;
  };
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { isClient } = useRole();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isClient) {
      navigate('/');
      return;
    }
    if (user) {
      loadServiceRequests();
      loadProposals();
    }
  }, [user, isClient]);

  const loadServiceRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar solicitações:', error);
        toast.error('Erro ao carregar suas solicitações');
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast.error('Erro ao carregar suas solicitações');
    } finally {
      setLoading(false);
    }
  };

  const loadProposals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          professionals (
            name, email, profession, rating, total_reviews, hourly_rate
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar propostas:', error);
        return;
      }

      setProposals(data as Proposal[] || []);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      proposta_enviada: { label: 'Proposta Recebida', variant: 'default' as const },
      contratado: { label: 'Contratado', variant: 'outline' as const },
      em_execucao: { label: 'Em Execução', variant: 'default' as const },
      completed: { label: 'Concluído', variant: 'outline' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { label: 'Baixa', variant: 'secondary' as const },
      normal: { label: 'Normal', variant: 'default' as const },
      high: { label: 'Alta', variant: 'default' as const },
      urgent: { label: 'Urgente', variant: 'destructive' as const }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard do Cliente</h1>
          <Link to="/service-request">
            <Button>Nova Solicitação</Button>
          </Link>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">
              Minhas Solicitações ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="proposals">
              Propostas Recebidas ({proposals.length})
            </TabsTrigger>
            <TabsTrigger value="conversations">Conversas</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <div className="flex gap-2">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgency)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{request.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Orçamento: R$ {request.budget}</span>
                      <span>{request.location}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Urgência: {request.urgency}</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/conversation/${request.id}`)}
                        disabled={!request.professional_id}
                      >
                        {request.professional_id ? 'Ver Conversa' : 'Aguardando Profissional'}
                      </Button>
                      {request.status === 'proposta_enviada' && (
                        <Badge variant="default">Nova Proposta!</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {requests.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não fez nenhuma solicitação de serviço.
                  </p>
                  <Link to="/service-request">
                    <Button>Criar Primeira Solicitação</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-4">
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal}
                  onUpdate={() => {
                    loadProposals();
                    loadServiceRequests();
                  }}
                  canRespond={true}
                />
              ))}
            </div>
            {proposals.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Você ainda não recebeu nenhuma proposta.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="conversations" className="space-y-4">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  As conversas aparecerão aqui quando um profissional for contratado.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  O histórico de serviços concluídos aparecerá aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;