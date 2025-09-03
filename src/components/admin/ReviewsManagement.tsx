import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Star, 
  User,
  MessageSquare,
  Calendar,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  service_title?: string;
  client_name?: string;
  professional_name?: string;
  professional_profession?: string;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Buscar dados relacionados separadamente
      const reviewsWithDetails = await Promise.all(
        (data || []).map(async (review) => {
          let serviceTitle = 'Serviço';
          let clientName = 'Cliente';
          let professionalName = '';
          let professionalProfession = '';

          // Buscar dados do serviço
          const { data: serviceRequest } = await supabase
            .from('service_requests')
            .select('title')
            .eq('id', review.service_request_id)
            .single();

          if (serviceRequest) {
            serviceTitle = serviceRequest.title;
          }

          // Buscar nome do cliente
          const { data: clientProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', review.client_id)
            .single();

          if (clientProfile) {
            clientName = clientProfile.display_name || 'Cliente';
          }

          // Buscar dados do profissional
          const { data: professional } = await supabase
            .from('professionals')
            .select('name, profession')
            .eq('id', review.professional_id)
            .single();

          if (professional) {
            professionalName = professional.name;
            professionalProfession = professional.profession;
          }

          return {
            ...review,
            service_title: serviceTitle,
            client_name: clientName,
            professional_name: professionalName,
            professional_profession: professionalProfession
          };
        })
      );

      setReviews(reviewsWithDetails);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success('Avaliação excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      toast.error('Erro ao excluir avaliação');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review =>
    review.professional_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.service_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Avaliações</CardTitle>
          <CardDescription>Carregando avaliações...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas das Avaliações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo das Avaliações</CardTitle>
            <CardDescription>Estatísticas gerais de satisfação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
              <span className="text-muted-foreground">({reviews.length} avaliações)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Notas</CardTitle>
            <CardDescription>Breakdown das avaliações por estrelas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Avaliações</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as avaliações dos profissionais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar avaliações por profissional, cliente ou comentário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {review.client_name || 'Cliente'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.professional_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.professional_profession}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{review.service_title}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(review.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedReview(review)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Avaliação</DialogTitle>
                            <DialogDescription>
                              Avaliação de {selectedReview?.client_name} para {selectedReview?.professional_name}
                            </DialogDescription>
                            </DialogHeader>
                            {selectedReview && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong>Cliente:</strong>
                                    <p>{selectedReview.client_name}</p>
                                  </div>
                                  <div>
                                    <strong>Profissional:</strong>
                                    <p>{selectedReview.professional_name}</p>
                                  </div>
                                  <div>
                                    <strong>Serviço:</strong>
                                    <p>{selectedReview.service_title}</p>
                                  </div>
                                  <div>
                                    <strong>Data:</strong>
                                    <p>{format(new Date(selectedReview.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <strong>Avaliação:</strong>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">{renderStars(selectedReview.rating)}</div>
                                    <span className="font-medium">{selectedReview.rating}/5</span>
                                  </div>
                                </div>

                                {selectedReview.comment && (
                                  <div>
                                    <strong>Comentário:</strong>
                                    <p className="mt-1 p-3 bg-muted rounded-lg text-sm">
                                      {selectedReview.comment}
                                    </p>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => deleteReview(selectedReview.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir Avaliação
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma avaliação encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;