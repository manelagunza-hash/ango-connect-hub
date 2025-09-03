import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, MessageSquare, Star, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsData {
  totalProfessionals: number;
  activeProfessionals: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalConversations: number;
  totalReviews: number;
  averageRating: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalProfessionals: 0,
    activeProfessionals: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalConversations: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas dos profissionais
      const { data: professionalsData } = await supabase
        .from('professionals')
        .select('is_available');

      // Buscar estatísticas das solicitações
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select('status');

      // Buscar estatísticas das conversas
      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('id');

      // Buscar estatísticas das avaliações
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating');

      const totalProfessionals = professionalsData?.length || 0;
      const activeProfessionals = professionalsData?.filter(p => p.is_available).length || 0;
      
      const totalRequests = requestsData?.length || 0;
      const pendingRequests = requestsData?.filter(r => r.status === 'pending').length || 0;
      const completedRequests = requestsData?.filter(r => r.status === 'completed').length || 0;
      
      const totalConversations = conversationsData?.length || 0;
      const totalReviews = reviewsData?.length || 0;
      const averageRating = reviewsData?.length 
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length 
        : 0;

      setStats({
        totalProfessionals,
        activeProfessionals,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalConversations,
        totalReviews,
        averageRating,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total de Profissionais",
      value: stats.totalProfessionals,
      subtitle: `${stats.activeProfessionals} ativos`,
      icon: Users,
      trend: stats.activeProfessionals > stats.totalProfessionals * 0.7 ? "up" : "down",
      color: "text-blue-600",
    },
    {
      title: "Solicitações de Serviço",
      value: stats.totalRequests,
      subtitle: `${stats.pendingRequests} pendentes`,
      icon: FileText,
      trend: stats.pendingRequests < stats.totalRequests * 0.3 ? "up" : "down",
      color: "text-green-600",
    },
    {
      title: "Conversas Ativas",
      value: stats.totalConversations,
      subtitle: "Comunicação em tempo real",
      icon: MessageSquare,
      trend: "up",
      color: "text-purple-600",
    },
    {
      title: "Avaliações",
      value: stats.totalReviews,
      subtitle: `${stats.averageRating.toFixed(1)} ⭐ média`,
      icon: Star,
      trend: stats.averageRating >= 4.0 ? "up" : "down",
      color: "text-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium">
                    {stat.title}
                  </CardDescription>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <TrendIcon 
                    className={`h-4 w-4 ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Solicitações</CardTitle>
            <CardDescription>Distribuição atual das solicitações de serviço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pendentes</span>
              <Badge variant="secondary">{stats.pendingRequests}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Concluídas</span>
              <Badge variant="outline">{stats.completedRequests}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <Badge>{stats.totalRequests}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo da Qualidade</CardTitle>
            <CardDescription>Métricas de satisfação dos clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avaliação Média</span>
              <Badge variant="secondary">{stats.averageRating.toFixed(1)} ⭐</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de Avaliações</span>
              <Badge variant="outline">{stats.totalReviews}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profissionais Ativos</span>
              <Badge>
                {Math.round((stats.activeProfessionals / stats.totalProfessionals || 0) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;