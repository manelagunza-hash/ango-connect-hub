import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, Send, Search, Filter, Heart, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  urgency: string;
  budget: number;
  location: string;
  created_at: string;
  client_id: string;
  profiles?: {
    display_name?: string;
  };
}

export function ProfessionalOpportunities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);

  // Estado para o modal de proposta
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalDuration, setProposalDuration] = useState('');

  // Filtros
  const [searchText, setSearchText] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [availableRequests, searchText, filterUrgency, filterLocation, minBudget, maxBudget, sortBy]);

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
      await loadAvailableRequests();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar oportunidades');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar solicitações:', error);
      return;
    }

    setAvailableRequests(data || []);
  };

  const applyFilters = () => {
    let filtered = [...availableRequests];

    // Busca textual
    if (searchText) {
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(searchText.toLowerCase()) ||
        req.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por urgência
    if (filterUrgency !== 'all') {
      filtered = filtered.filter(req => req.urgency === filterUrgency);
    }

    // Filtro por localização
    if (filterLocation !== 'all') {
      filtered = filtered.filter(req => req.location.includes(filterLocation));
    }

    // Filtro por orçamento
    if (minBudget) {
      filtered = filtered.filter(req => req.budget >= parseFloat(minBudget));
    }
    if (maxBudget) {
      filtered = filtered.filter(req => req.budget <= parseFloat(maxBudget));
    }

    // Ordenação
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'budget_high') {
      filtered.sort((a, b) => b.budget - a.budget);
    } else if (sortBy === 'budget_low') {
      filtered.sort((a, b) => a.budget - b.budget);
    } else if (sortBy === 'urgent') {
      filtered.sort((a, b) => (a.urgency === 'urgent' ? -1 : 1));
    }

    setFilteredRequests(filtered);
  };

  const toggleFavorite = (requestId: string) => {
    setFavorites(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      urgent: { variant: 'destructive' as const, label: 'Urgente' },
      high: { variant: 'default' as const, label: 'Alta' },
      normal: { variant: 'secondary' as const, label: 'Normal' },
      low: { variant: 'outline' as const, label: 'Baixa' }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSendProposal = async () => {
    if (!selectedRequest || !professional) return;

    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          service_request_id: selectedRequest.id,
          professional_id: professional.id,
          client_id: selectedRequest.client_id,
          price: parseFloat(proposalPrice),
          message: proposalMessage,
          estimated_duration: parseInt(proposalDuration)
        });

      if (error) throw error;

      // Atualizar status da solicitação
      await supabase
        .from('service_requests')
        .update({ status: 'proposta_enviada' })
        .eq('id', selectedRequest.id);

      toast.success('Proposta enviada com sucesso!');
      
      // Resetar formulário
      setSelectedRequest(null);
      setProposalPrice('');
      setProposalMessage('');
      setProposalDuration('');
      
      // Recarregar dados
      loadData();

    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      toast.error('Erro ao enviar proposta. Tente novamente.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pendente' },
      proposta_enviada: { variant: 'default' as const, label: 'Proposta Enviada' },
      contratado: { variant: 'default' as const, label: 'Contratado' },
      em_execucao: { variant: 'default' as const, label: 'Em Execução' },
      completed: { variant: 'default' as const, label: 'Concluído' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">
          Encontre projetos e envie suas propostas
        </p>
      </div>

      {/* Filtros Avançados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Urgência */}
            <div>
              <Label>Urgência</Label>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Localização */}
            <div>
              <Label>Localização</Label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Luanda">Luanda</SelectItem>
                  <SelectItem value="Benguela">Benguela</SelectItem>
                  <SelectItem value="Huambo">Huambo</SelectItem>
                  <SelectItem value="Lobito">Lobito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orçamento Mínimo */}
            <div>
              <Label>Orçamento Mínimo (AOA)</Label>
              <Input
                type="number"
                placeholder="0"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
              />
            </div>

            {/* Orçamento Máximo */}
            <div>
              <Label>Orçamento Máximo (AOA)</Label>
              <Input
                type="number"
                placeholder="0"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex gap-4 items-center">
            <Label>Ordenar por:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="budget_high">Maior Orçamento</SelectItem>
                <SelectItem value="budget_low">Menor Orçamento</SelectItem>
                <SelectItem value="urgent">Mais Urgentes</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-auto">
              {filteredRequests.length} oportunidade(s) encontrada(s)
            </span>
          </div>
        </CardContent>
      </Card>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchText || filterUrgency !== 'all' || filterLocation !== 'all' || minBudget || maxBudget
                  ? 'Nenhuma oportunidade encontrada com os filtros aplicados.'
                  : 'Não há oportunidades disponíveis no momento.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(request.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Heart 
                          className={`h-4 w-4 ${favorites.includes(request.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </Button>
                    </div>
                    <CardDescription className="flex items-center gap-2 flex-wrap mt-1">
                      {request.profiles?.display_name} • {request.location} • 
                      {new Date(request.created_at).toLocaleDateString('pt-BR')}
                      {getUrgencyBadge(request.urgency)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {request.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    AOA {request.budget?.toLocaleString('pt-BR')}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/conversation/${request.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Proposta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Proposta</DialogTitle>
                          <DialogDescription>
                            Envie sua proposta para: {request.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="price">Preço (AOA)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={proposalPrice}
                              onChange={(e) => setProposalPrice(e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Duração estimada (dias)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={proposalDuration}
                              onChange={(e) => setProposalDuration(e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Mensagem</Label>
                            <Textarea
                              id="message"
                              value={proposalMessage}
                              onChange={(e) => setProposalMessage(e.target.value)}
                              placeholder="Descreva sua proposta e experiência..."
                              rows={4}
                            />
                          </div>
                          <Button 
                            onClick={handleSendProposal}
                            className="w-full"
                            disabled={!proposalPrice || !proposalMessage || !proposalDuration}
                          >
                            Enviar Proposta
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}