import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Proposal {
  id: string;
  service_request_id: string;
  price: number;
  message: string;
  estimated_duration: number;
  status: string;
  created_at: string;
}

export function ProfessionalProposals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
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
      await loadMyProposals(professionalData.id);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
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

    setProposals(data || []);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Minhas Propostas</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o status das suas propostas enviadas
        </p>
      </div>

      {proposals.length === 0 ? (
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
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Projeto #{proposal.service_request_id.slice(-8)}
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
    </div>
  );
}