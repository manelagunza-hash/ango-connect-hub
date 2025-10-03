import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { DollarSign, Briefcase, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalProposals: number;
  acceptedProposals: number;
  conversionRate: number;
  totalEarnings: number;
  averageRating: number;
  completedProjects: number;
  activeProjects: number;
  pendingProposals: number;
}

export function ProfessionalDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      // Get professional data
      const { data: professional } = await supabase
        .from('professionals')
        .select('id, rating, total_reviews')
        .eq('user_id', user.id)
        .single();

      if (!professional) return;

      // Get proposals stats
      const { data: proposals } = await supabase
        .from('proposals')
        .select('status, price')
        .eq('professional_id', professional.id);

      const totalProposals = proposals?.length || 0;
      const acceptedProposals = proposals?.filter(p => p.status === 'accepted').length || 0;
      const pendingProposals = proposals?.filter(p => p.status === 'pending').length || 0;
      const conversionRate = totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0;

      // Get service requests stats
      const { data: serviceRequests } = await supabase
        .from('service_requests')
        .select('status')
        .eq('professional_id', professional.id);

      const completedProjects = serviceRequests?.filter(sr => sr.status === 'completed').length || 0;
      const activeProjects = serviceRequests?.filter(sr => sr.status === 'in_progress').length || 0;

      // Calculate total earnings (accepted proposals)
      const totalEarnings = proposals
        ?.filter(p => p.status === 'accepted')
        .reduce((sum, p) => sum + (Number(p.price) || 0), 0) || 0;

      setStats({
        totalProposals,
        acceptedProposals,
        conversionRate,
        totalEarnings,
        averageRating: Number(professional.rating) || 0,
        completedProjects,
        activeProjects,
        pendingProposals
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Propostas Enviadas</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProposals}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingProposals} pendentes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.acceptedProposals} propostas aceitas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {stats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            De propostas aceitas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            ⭐ Baseado em avaliações
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            Em andamento
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projetos Completos</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedProjects}</div>
          <p className="text-xs text-muted-foreground">
            Finalizados com sucesso
          </p>
        </CardContent>
      </Card>
    </div>
  );
}