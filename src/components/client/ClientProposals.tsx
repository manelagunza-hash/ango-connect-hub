import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { ProposalCard } from '@/components/ProposalCard';
import { toast } from 'sonner';

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

export function ClientProposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  const loadProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      toast.error('Erro ao carregar propostas');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-foreground">Propostas Recebidas</h1>
        <p className="text-sm text-muted-foreground">
          Analise e responda às propostas dos profissionais
        </p>
      </div>

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
              onUpdate={loadProposals}
              canRespond={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}