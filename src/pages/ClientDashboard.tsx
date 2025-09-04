import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  urgency: string;
  status: string;
  created_at: string;
  professional_id: string | null;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadServiceRequests();
    }
  }, [user]);

  const loadServiceRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar solicitações:', error);
      toast.error('Erro ao carregar suas solicitações');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      assigned: { label: 'Atribuído', variant: 'default' as const },
      in_progress: { label: 'Em Progresso', variant: 'default' as const },
      completed: { label: 'Concluído', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyMap = {
      low: { label: 'Baixa', variant: 'secondary' as const },
      normal: { label: 'Normal', variant: 'default' as const },
      high: { label: 'Alta', variant: 'default' as const },
      urgent: { label: 'Urgente', variant: 'destructive' as const }
    };
    
    const urgencyInfo = urgencyMap[urgency as keyof typeof urgencyMap] || urgencyMap.normal;
    
    return (
      <Badge variant={urgencyInfo.variant}>
        {urgencyInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Meu Dashboard</h1>
            <Link to="/service-request">
              <Button>Nova Solicitação</Button>
            </Link>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList>
              <TabsTrigger value="requests">Minhas Solicitações</TabsTrigger>
              <TabsTrigger value="conversations">Conversas</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <div className="grid gap-4">
                {requests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        Você ainda não fez nenhuma solicitação de serviço.
                      </p>
                      <Link to="/service-request">
                        <Button>Criar Primeira Solicitação</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  requests.map((request) => (
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
                      <CardContent>
                        <p className="text-muted-foreground mb-2">{request.description}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>{request.location}</span>
                          {request.budget && <span>Orçamento: {request.budget} Kz</span>}
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                        {request.professional_id && (
                          <div className="mt-3">
                            <Link to={`/conversation/${request.id}`}>
                              <Button variant="outline" size="sm">
                                Ver Conversa
                              </Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="conversations">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    As conversas aparecerão aqui quando um profissional for atribuído às suas solicitações.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    O histórico de serviços concluídos aparecerá aqui.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;