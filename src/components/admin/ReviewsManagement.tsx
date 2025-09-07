import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client_name?: string;
  professional_name?: string;
  service_title?: string;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          professionals!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews = data?.map(review => ({
        ...review,
        client_name: 'Cliente',
        professional_name: review.professionals?.name || 'Profissional',
        service_title: 'Serviço'
      })) || [];

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Avaliação removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover avaliação:', error);
      toast.error('Erro ao remover avaliação');
    }
  };

  const viewReview = (review: Review) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const filteredReviews = reviews.filter(review =>
    review.professional_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.service_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingBadge = (rating: number) => {
    if (rating >= 5) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (rating >= 4) return <Badge className="bg-blue-100 text-blue-800">Muito Bom</Badge>;
    if (rating >= 3) return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    if (rating >= 2) return <Badge className="bg-orange-100 text-orange-800">Regular</Badge>;
    return <Badge className="bg-red-100 text-red-800">Ruim</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Gestão de Avaliações
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as avaliações da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar avaliações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={16} 
                              className={`${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({review.rating}/5)
                          </span>
                        </div>
                        {getRatingBadge(review.rating)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                        <div><strong>Cliente:</strong> {review.client_name}</div>
                        <div><strong>Profissional:</strong> {review.professional_name}</div>
                        <div><strong>Serviço:</strong> {review.service_title}</div>
                      </div>

                      {review.comment && (
                        <p className="text-sm mb-2 line-clamp-2">{review.comment}</p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')} às {new Date(review.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewReview(review)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReview(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReviews.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma avaliação encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
            <DialogDescription>
              Informações completas da avaliação selecionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={20} 
                      className={`${star <= selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  {selectedReview.rating}/5
                </span>
                {getRatingBadge(selectedReview.rating)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{selectedReview.client_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profissional</p>
                  <p className="font-semibold">{selectedReview.professional_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Serviço</p>
                  <p className="font-semibold">{selectedReview.service_title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p className="font-semibold">
                    {new Date(selectedReview.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {selectedReview.comment && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Comentário</p>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedReview.comment}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Fechar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteReview(selectedReview.id);
                    setDialogOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Avaliação
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsManagement;