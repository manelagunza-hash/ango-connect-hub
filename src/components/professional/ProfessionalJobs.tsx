import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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

export function ProfessionalJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);

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
      await loadActiveJobs(professionalData.id);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar trabalhos ativos');
    } finally {
      setLoading(false);
    }
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

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status: newStatus,
          ...(newStatus === 'completed' && { completed_at: new Date().toISOString() })
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
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
        <h1 className="text-2xl font-bold text-foreground">Trabalhos Ativos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus trabalhos em andamento
        </p>
      </div>

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
                  Cliente: #{job.client_id.slice(-8)} • {job.location}
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
                    {job.status === 'contratado' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(job.id, 'em_execucao')}
                      >
                        Iniciar Trabalho
                      </Button>
                    )}
                    {job.status === 'em_execucao' && (
                      <Button 
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusUpdate(job.id, 'completed')}
                      >
                        Finalizar
                      </Button>
                    )}
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