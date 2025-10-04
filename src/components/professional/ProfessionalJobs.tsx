import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Clock, CheckCircle, AlertCircle, Calendar, FileText, Upload } from 'lucide-react';
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
  const [completionNote, setCompletionNote] = useState('');

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
      setCompletionNote('');
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getJobProgress = (status: string) => {
    const progressMap = {
      'contratado': 0,
      'em_execucao': 50,
      'completed': 100
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  };

  const getDaysRemaining = (createdAt: string, estimatedDays: number = 7) => {
    const created = new Date(createdAt);
    const deadline = new Date(created);
    deadline.setDate(deadline.getDate() + estimatedDays);
    const now = new Date();
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { days: diff, deadline };
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
          {activeJobs.map((job) => {
            const progress = getJobProgress(job.status);
            const { days: daysRemaining, deadline } = getDaysRemaining(job.created_at);
            
            return (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Cliente: #{job.client_id.slice(-8)} • {job.location}
                      </CardDescription>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>

                  {/* Timeline Visual */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Projeto</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className={`h-3 w-3 ${progress >= 0 ? 'text-green-500' : ''}`} />
                        Contratado
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className={`h-3 w-3 ${progress >= 50 ? 'text-yellow-500' : ''}`} />
                        Em Execução
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className={`h-3 w-3 ${progress >= 100 ? 'text-green-500' : ''}`} />
                        Concluído
                      </div>
                    </div>
                  </div>

                  {/* Prazo */}
                  {job.status !== 'completed' && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Prazo estimado:</span> {deadline.toLocaleDateString('pt-BR')}
                        {daysRemaining > 0 ? (
                          <span className="ml-2 text-muted-foreground">({daysRemaining} dias restantes)</span>
                        ) : (
                          <Badge variant="destructive" className="ml-2">Atrasado</Badge>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-lg">
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Finalizar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Finalizar Trabalho</DialogTitle>
                              <DialogDescription>
                                Confirme a conclusão do trabalho: {job.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="completion-note">Notas de Conclusão (opcional)</Label>
                                <Textarea
                                  id="completion-note"
                                  value={completionNote}
                                  onChange={(e) => setCompletionNote(e.target.value)}
                                  placeholder="Adicione detalhes sobre a conclusão do trabalho..."
                                  rows={4}
                                />
                              </div>
                              <Button 
                                onClick={() => handleStatusUpdate(job.id, 'completed')}
                                className="w-full"
                              >
                                Confirmar Conclusão
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}