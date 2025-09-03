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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Plus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  description: string;
  hourly_rate: number;
  location: string;
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

  const updateProfessionalStatus = async (id: string, field: 'is_verified' | 'is_available', value: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setProfessionals(prev => 
        prev.map(p => 
          p.id === id ? { ...p, [field]: value } : p
        )
      );

      toast.success(`Profissional ${value ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do profissional');
    }
  };

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Profissionais</CardTitle>
          <CardDescription>Carregando profissionais...</CardDescription>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gerenciar Profissionais</CardTitle>
            <CardDescription>
              Visualize, aprove e gerencie profissionais cadastrados no sistema.
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Profissional
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar profissionais por nome, profissão ou email..."
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
                <TableHead>Profissional</TableHead>
                <TableHead>Profissão</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{professional.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {professional.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{professional.profession}</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {professional.hourly_rate}/hora
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {professional.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{professional.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({professional.total_reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={professional.is_verified ? "default" : "secondary"}>
                        {professional.is_verified ? "Verificado" : "Pendente"}
                      </Badge>
                      <Badge variant={professional.is_available ? "outline" : "destructive"}>
                        {professional.is_available ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedProfessional(professional)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Profissional</DialogTitle>
                            <DialogDescription>
                              Informações completas sobre {selectedProfessional?.name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedProfessional && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nome</Label>
                                  <p className="font-medium">{selectedProfessional.name}</p>
                                </div>
                                <div>
                                  <Label>Profissão</Label>
                                  <p className="font-medium">{selectedProfessional.profession}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p>{selectedProfessional.email}</p>
                                </div>
                                <div>
                                  <Label>Telefone</Label>
                                  <p>{selectedProfessional.phone}</p>
                                </div>
                                <div>
                                  <Label>Valor por Hora</Label>
                                  <p>R$ {selectedProfessional.hourly_rate}</p>
                                </div>
                                <div>
                                  <Label>Localização</Label>
                                  <p>{selectedProfessional.location}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Descrição</Label>
                                <p className="mt-1 text-sm">{selectedProfessional.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant={selectedProfessional.is_verified ? "outline" : "default"}
                                  onClick={() => updateProfessionalStatus(
                                    selectedProfessional.id, 
                                    'is_verified', 
                                    !selectedProfessional.is_verified
                                  )}
                                >
                                  {selectedProfessional.is_verified ? "Remover Verificação" : "Verificar"}
                                </Button>
                                <Button
                                  variant={selectedProfessional.is_available ? "destructive" : "default"}
                                  onClick={() => updateProfessionalStatus(
                                    selectedProfessional.id, 
                                    'is_available', 
                                    !selectedProfessional.is_available
                                  )}
                                >
                                  {selectedProfessional.is_available ? "Desativar" : "Ativar"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant={professional.is_verified ? "outline" : "default"}
                        size="sm"
                        onClick={() => updateProfessionalStatus(
                          professional.id, 
                          'is_verified', 
                          !professional.is_verified
                        )}
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum profissional encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalsManagement;