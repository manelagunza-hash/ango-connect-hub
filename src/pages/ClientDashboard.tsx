import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { supabase } from '@/integrations/supabase/client';
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
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isClient) {
      loadData();
    } else if (!isClient) {
      navigate('/dashboard');
    }
  }, [user, isClient, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadServiceRequests(), loadProposals()]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadServiceRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar solicitações:', error);
      return;
    }

    setRequests(data || []);
  };

  const loadProposals = async () => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar propostas:', error);
      return;
    }

    setProposals(data || []);
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

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { variant: 'secondary' as const, label: 'Baixa' },
      normal: { variant: 'default' as const, label: 'Normal' },
      high: { variant: 'destructive' as const, label: 'Alta' }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
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
      <Tabs defaultValue="requests" className="w-full">
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

        <TabsContent value="requests" className="space-y-4 mt-6">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não tem solicitações de serviço.
                  </p>
                  <Link to="/service-request">
                    <Button>Criar primeira solicitação</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                    <CardDescription className="text-sm">
                      Criado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                      {request.location && ` • ${request.location}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {request.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Orçamento: AOA {request.budget?.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/conversation/${request.id}`)}
                      >
                        Ver Conversas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4 mt-6">
          {proposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Você ainda não recebeu propostas.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {proposals.map((proposal) => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal}
                  onUpdate={loadData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Funcionalidade de conversas em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Histórico será exibido aqui em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;