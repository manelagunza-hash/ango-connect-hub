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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Eye, 
  Calendar, 
  MapPin,
  DollarSign,
  Clock,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  status: string;
  urgency: string;
  scheduled_date: string;
  created_at: string;
  client_id: string;
  professional_id: string;
  client_name?: string;
  professional_name?: string;
}

const ServiceRequestsManagement = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    fetchRequests();
    fetchProfessionals();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Buscar dados relacionados separadamente
      const requestsWithDetails = await Promise.all(
        (data || []).map(async (request) => {
          let clientName = 'Cliente';
          let professionalName = '';

          // Buscar nome do cliente
          const { data: clientProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', request.client_id)
            .single();

          if (clientProfile) {
            clientName = clientProfile.display_name || 'Cliente';
          }

          // Buscar nome do profissional se atribuído
          if (request.professional_id) {
            const { data: professional } = await supabase
              .from('professionals')
              .select('name')
              .eq('id', request.professional_id)
              .single();

            if (professional) {
              professionalName = professional.name;
            }
          }

          return {
            ...request,
            client_name: clientName,
            professional_name: professionalName
          };
        })
      );

      setRequests(requestsWithDetails);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name, profession, is_available')
        .eq('is_available', true);

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('service_requests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => 
        prev.map(r => 
          r.id === id ? { ...r, status } : r
        )
      );

      toast.success('Status da solicitação atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da solicitação');
    }
  };

  const assignProfessional = async (requestId: string, professionalId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          professional_id: professionalId,
          status: 'assigned'
        })
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests(); // Recarregar dados
      toast.success('Profissional atribuído com sucesso');
    } catch (error) {
      console.error('Erro ao atribuir profissional:', error);
      toast.error('Erro ao atribuir profissional');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'assigned': return 'default';
      case 'in_progress': return 'outline';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'secondary';
      case 'normal': return 'outline';
      case 'high': return 'default';
      case 'urgent': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Solicitações</CardTitle>
          <CardDescription>Carregando solicitações...</CardDescription>
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
        <CardTitle>Gerenciar Solicitações de Serviço</CardTitle>
        <CardDescription>
          Visualize, atribua profissionais e acompanhe o status das solicitações.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar solicitações por título, descrição ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="assigned">Atribuído</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solicitação</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Urgência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        R$ {request.budget}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {request.client_name || 'Usuário'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.professional_name || (
                      <Badge variant="secondary">Não atribuído</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getUrgencyColor(request.urgency)}>
                      {request.urgency === 'urgent' ? 'Urgente' :
                       request.urgency === 'high' ? 'Alta' :
                       request.urgency === 'normal' ? 'Normal' : 'Baixa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(request.status)}>
                      {request.status === 'pending' ? 'Pendente' :
                       request.status === 'assigned' ? 'Atribuído' :
                       request.status === 'in_progress' ? 'Em Progresso' :
                       request.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Solicitação</DialogTitle>
                            <DialogDescription>
                              Gerenciar solicitação de {selectedRequest?.client_name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Título</Label>
                                  <p className="font-medium">{selectedRequest.title}</p>
                                </div>
                                <div>
                                  <Label>Cliente</Label>
                                  <p>{selectedRequest.client_name}</p>
                                </div>
                                <div>
                                  <Label>Orçamento</Label>
                                  <p>R$ {selectedRequest.budget}</p>
                                </div>
                                <div>
                                  <Label>Localização</Label>
                                  <p>{selectedRequest.location}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Descrição</Label>
                                <p className="mt-1 text-sm">{selectedRequest.description}</p>
                              </div>
                              
                              {!selectedRequest.professional_id && (
                                <div>
                                  <Label>Atribuir Profissional</Label>
                                  <Select onValueChange={(value) => assignProfessional(selectedRequest.id, value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecionar profissional" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {professionals.map((prof) => (
                                        <SelectItem key={prof.id} value={prof.id}>
                                          {prof.name} - {prof.profession}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                <Select onValueChange={(value) => updateRequestStatus(selectedRequest.id, value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Alterar status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="assigned">Atribuído</SelectItem>
                                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                                    <SelectItem value="completed">Concluído</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {request.status === 'pending' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'assigned')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceRequestsManagement;