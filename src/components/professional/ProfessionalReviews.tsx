import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Award, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client_id: string;
  service_request_id: string;
  service_requests?: {
    title: string;
  };
}

export function ProfessionalReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filterRating, reviews]);

  const loadData = async () => {
    try {
      setLoading(true);
      
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
      await loadReviews(professionalData.id);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (professionalId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, service_requests(title)')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar avaliações:', error);
      return;
    }

    setReviews(data || []);
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filterRating));
    }

    setFilteredReviews(filtered);
  };

  const getStatsData = () => {
    if (reviews.length === 0) return { avgRating: '0', totalReviews: 0, ratingDistribution: {} as Record<string, number> };

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const ratingDistribution = reviews.reduce((acc, r) => {
      const key = r.rating.toString();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
      ratingDistribution
    };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const getBadges = () => {
    const stats = getStatsData();
    const badges = [];

    if (reviews.length >= 10) badges.push({ icon: Award, label: '10+ Avaliações', color: 'text-blue-500' });
    if (reviews.length >= 50) badges.push({ icon: Award, label: '50+ Avaliações', color: 'text-purple-500' });
    if (parseFloat(stats.avgRating) >= 4.5) badges.push({ icon: Star, label: 'Excelente', color: 'text-yellow-500' });
    if (reviews.filter(r => r.rating === 5).length >= 5) badges.push({ icon: TrendingUp, label: '5 Estrelas', color: 'text-green-500' });

    return badges;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getStatsData();
  const badges = getBadges();

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Avaliações</h1>
        <p className="text-sm text-muted-foreground">
          Veja o que os clientes dizem sobre seu trabalho
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avaliação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{stats.avgRating}</span>
              {renderStars(Math.round(parseFloat(stats.avgRating)))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{stats.totalReviews}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Distribuição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingKey = rating.toString();
                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ 
                          width: `${stats.totalReviews > 0 ? ((stats.ratingDistribution[ratingKey] || 0) / stats.totalReviews) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">
                      {stats.ratingDistribution[ratingKey] || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges/Conquistas */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-2">
                  <badge.icon className={`h-4 w-4 mr-2 ${badge.color}`} />
                  {badge.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estrelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as estrelas</SelectItem>
            <SelectItem value="5">5 estrelas</SelectItem>
            <SelectItem value="4">4 estrelas</SelectItem>
            <SelectItem value="3">3 estrelas</SelectItem>
            <SelectItem value="2">2 estrelas</SelectItem>
            <SelectItem value="1">1 estrela</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredReviews.length} avaliação(ões) encontrada(s)
        </span>
      </div>

      {/* Lista de Avaliações */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {filterRating !== 'all' 
                  ? 'Nenhuma avaliação encontrada com este filtro.'
                  : 'Você ainda não recebeu avaliações.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {review.service_requests?.title || 'Serviço'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  {renderStars(review.rating)}
                </div>
              </CardHeader>
              <CardContent>
                {review.comment && (
                  <p className="text-sm text-muted-foreground italic">
                    "{review.comment}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
