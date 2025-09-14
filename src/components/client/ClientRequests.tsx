import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

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

export function ClientRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadServiceRequests();
    }
  }, [user]);

  const loadServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minhas Solicitações</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas solicitações de serviço
          </p>
        </div>
        <Button onClick={() => navigate('/service-request')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

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
    </div>
  );
}