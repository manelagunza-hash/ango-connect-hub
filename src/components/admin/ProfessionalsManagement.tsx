import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Eye, CheckCircle, XCircle, Star, MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Professional {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profession: string;
  description?: string;
  location?: string;
  hourly_rate?: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_available: boolean;
  created_at: string;
}

const ProfessionalsManagement = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      toast.error('Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  const updateProfessionalStatus = async (professionalId: string, field: 'is_verified' | 'is_available', value: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ [field]: value })
        .eq('id', professionalId);

      if (error) throw error;

      setProfessionals(professionals.map(prof => 
        prof.id === professionalId ? { ...prof, [field]: value } : prof
      ));

      const actionText = field === 'is_verified' 
        ? (value ? 'verificado' : 'não verificado')
        : (value ? 'ativado' : 'desativado');
      
      toast.success(`Profissional ${actionText} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      toast.error('Erro ao atualizar profissional');
    }
  };

  const viewProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setDialogOpen(true);
  };

  const filteredProfessionals = professionals.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isVerified: boolean, isAvailable: boolean) => {
    if (isVerified && isAvailable) {
      return <Badge className="bg-green-100 text-green-800">Ativo e Verificado</Badge>;
    } else if (isVerified) {
      return <Badge className="bg-yellow-100 text-yellow-800">Verificado</Badge>;
    } else if (isAvailable) {
      return <Badge className="bg-blue-100 text-blue-800">Ativo</Badge>;
    } else {
      return <Badge variant="secondary">Inativo</Badge>;
    }
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
              <div className="h-20 bg-muted rounded"></div>
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
            <Users className="h-5 w-5" />
            Gestão de Profissionais
          </CardTitle>
          <CardDescription>
            Gerencie todos os profissionais cadastrados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar profissionais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Profissão</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>  
                  <TableHead>Localização</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <p className="text-sm text-muted-foreground">{professional.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{professional.profession}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {professional.rating.toFixed(1)} ({professional.total_reviews})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(professional.is_verified, professional.is_available)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={12} />
                        {professional.location || 'Não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProfessional(professional)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateProfessionalStatus(professional.id, 'is_verified', !professional.is_verified)}
                          className={professional.is_verified ? 'text-red-600' : 'text-green-600'}
                        >
                          {professional.is_verified ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProfessionals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum profissional encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Profissional</DialogTitle>
            <DialogDescription>
              Informações completas do profissional selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfessional && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="font-semibold text-lg">{selectedProfessional.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profissão</p>
                  <p className="font-semibold">{selectedProfessional.profession}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedProfessional.email}</p>
                  </div>
                </div>
                {selectedProfessional.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p>{selectedProfessional.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avaliação</p>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {selectedProfessional.rating.toFixed(1)} ({selectedProfessional.total_reviews} avaliações)
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedProfessional.is_verified, selectedProfessional.is_available)}
                </div>
                {selectedProfessional.hourly_rate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor/Hora</p>
                    <p className="font-semibold text-primary">
                      {selectedProfessional.hourly_rate.toLocaleString('pt-AO')} AOA
                    </p>
                  </div>
                )}
              </div>

              {selectedProfessional.location && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Localização</p>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-muted-foreground" />
                    <p>{selectedProfessional.location}</p>
                  </div>
                </div>
              )}

              {selectedProfessional.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedProfessional.description}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                <p>{new Date(selectedProfessional.created_at).toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Fechar
                </Button>
                <Button
                  variant={selectedProfessional.is_verified ? "secondary" : "default"}
                  onClick={() => {
                    updateProfessionalStatus(selectedProfessional.id, 'is_verified', !selectedProfessional.is_verified);
                    setSelectedProfessional({
                      ...selectedProfessional,
                      is_verified: !selectedProfessional.is_verified
                    });
                  }}
                >
                  {selectedProfessional.is_verified ? 'Remover Verificação' : 'Verificar Profissional'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalsManagement;