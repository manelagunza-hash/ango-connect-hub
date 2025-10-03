import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Star, MapPin, DollarSign, Edit2, Save, X, Plus, Trash2, Award, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  project_date?: string;
}

interface Certification {
  id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  is_verified: boolean;
}

interface Service {
  id: string;
  service_name: string;
  description?: string;
  base_price?: number;
  estimated_duration?: number;
  is_active: boolean;
}

export function ProfessionalProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Professional>>({});
  
  // Dialog states
  const [portfolioDialog, setPortfolioDialog] = useState(false);
  const [certificationDialog, setCertificationDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  
  // New item forms
  const [newPortfolio, setNewPortfolio] = useState<Partial<PortfolioItem>>({});
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({});
  const [newService, setNewService] = useState<Partial<Service>>({});

  useEffect(() => {
    loadProfessionalData();
    loadPortfolio();
    loadCertifications();
    loadServices();
  }, [user]);

  const loadProfessionalData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfessional(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error loading professional data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('professionals')
        .update(editForm)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso"
      });
      setEditing(false);
      loadProfessionalData();
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm(professional || {});
  };

  const loadPortfolio = async () => {
    if (!user) return;
    
    const { data: prof } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (!prof) return;
    
    const { data } = await supabase
      .from('professional_portfolio')
      .select('*')
      .eq('professional_id', prof.id)
      .order('project_date', { ascending: false });
    
    setPortfolio(data || []);
  };

  const loadCertifications = async () => {
    if (!user) return;
    
    const { data: prof } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (!prof) return;
    
    const { data } = await supabase
      .from('professional_certifications')
      .select('*')
      .eq('professional_id', prof.id)
      .order('issue_date', { ascending: false });
    
    setCertifications(data || []);
  };

  const loadServices = async () => {
    if (!user) return;
    
    const { data: prof } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (!prof) return;
    
    const { data } = await supabase
      .from('professional_services')
      .select('*')
      .eq('professional_id', prof.id)
      .eq('is_active', true);
    
    setServices(data || []);
  };

  const handleAddPortfolio = async () => {
    if (!professional || !newPortfolio.title) return;
    
    const { error } = await supabase
      .from('professional_portfolio')
      .insert({
        professional_id: professional.id,
        title: newPortfolio.title,
        description: newPortfolio.description,
        project_date: newPortfolio.project_date
      } as any);
    
    if (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar ao portfólio", variant: "destructive" });
      return;
    }
    
    toast({ title: "Sucesso", description: "Item adicionado ao portfólio" });
    setNewPortfolio({});
    setPortfolioDialog(false);
    loadPortfolio();
  };

  const handleAddCertification = async () => {
    if (!professional || !newCertification.title) return;
    
    const { error } = await supabase
      .from('professional_certifications')
      .insert({
        professional_id: professional.id,
        title: newCertification.title,
        issuer: newCertification.issuer,
        issue_date: newCertification.issue_date
      } as any);
    
    if (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar certificação", variant: "destructive" });
      return;
    }
    
    toast({ title: "Sucesso", description: "Certificação adicionada" });
    setNewCertification({});
    setCertificationDialog(false);
    loadCertifications();
  };

  const handleAddService = async () => {
    if (!professional || !newService.service_name) return;
    
    const { error } = await supabase
      .from('professional_services')
      .insert({
        professional_id: professional.id,
        service_name: newService.service_name,
        description: newService.description,
        base_price: newService.base_price,
        estimated_duration: newService.estimated_duration,
        is_active: true
      } as any);
    
    if (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar serviço", variant: "destructive" });
      return;
    }
    
    toast({ title: "Sucesso", description: "Serviço adicionado" });
    setNewService({});
    setServiceDialog(false);
    loadServices();
  };

  const handleDeletePortfolio = async (id: string) => {
    const { error } = await supabase
      .from('professional_portfolio')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: "Erro", description: "Não foi possível remover item", variant: "destructive" });
      return;
    }
    
    toast({ title: "Sucesso", description: "Item removido" });
    loadPortfolio();
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase
      .from('professional_services')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      toast({ title: "Erro", description: "Não foi possível desativar serviço", variant: "destructive" });
      return;
    }
    
    toast({ title: "Sucesso", description: "Serviço desativado" });
    loadServices();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Perfil profissional não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Perfil Profissional</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações profissionais
          </p>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          <TabsTrigger value="certifications">Certificações</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="flex items-center justify-end mb-4">
            {!editing ? (
              <Button onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {professional.name}
                    {professional.is_verified && (
                      <Badge>Verificado</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{professional.profession}</CardDescription>
                </div>
                <Badge variant={professional.is_available ? "default" : "secondary"}>
                  {professional.is_available ? 'Disponível' : 'Indisponível'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Profissão</Label>
                    <Input
                      value={editForm.profession || ''}
                      onChange={(e) => setEditForm({...editForm, profession: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Localização</Label>
                    <Input
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Taxa por Hora (R$)</Label>
                    <Input
                      type="number"
                      value={editForm.hourly_rate || ''}
                      onChange={(e) => setEditForm({...editForm, hourly_rate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{professional.location || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {professional.hourly_rate 
                        ? `R$ ${professional.hourly_rate.toLocaleString('pt-BR')}/hora`
                        : 'Não informado'}
                    </span>
                  </div>
                  {professional.description && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {professional.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Meu Portfólio</h2>
            <Dialog open={portfolioDialog} onOpenChange={setPortfolioDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Projeto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Projeto ao Portfólio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Título do Projeto</Label>
                    <Input
                      value={newPortfolio.title || ''}
                      onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={newPortfolio.description || ''}
                      onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Data do Projeto</Label>
                    <Input
                      type="date"
                      value={newPortfolio.project_date || ''}
                      onChange={(e) => setNewPortfolio({...newPortfolio, project_date: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddPortfolio} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {item.project_date && (
                    <CardDescription>
                      {new Date(item.project_date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePortfolio(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </CardContent>
              </Card>
            ))}
            {portfolio.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum projeto adicionado ainda
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Certificações</h2>
            <Dialog open={certificationDialog} onOpenChange={setCertificationDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Certificação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Certificação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Título da Certificação</Label>
                    <Input
                      value={newCertification.title || ''}
                      onChange={(e) => setNewCertification({...newCertification, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Instituição Emissora</Label>
                    <Input
                      value={newCertification.issuer || ''}
                      onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Data de Emissão</Label>
                    <Input
                      type="date"
                      value={newCertification.issue_date || ''}
                      onChange={(e) => setNewCertification({...newCertification, issue_date: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddCertification} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {certifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        {cert.title}
                        {cert.is_verified && (
                          <Badge variant="secondary">Verificado</Badge>
                        )}
                      </CardTitle>
                      {cert.issuer && (
                        <CardDescription>{cert.issuer}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {cert.issue_date && (
                    <p className="text-sm text-muted-foreground">
                      Emitido em: {new Date(cert.issue_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {certifications.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma certificação adicionada ainda
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Serviços Oferecidos</h2>
            <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Serviço</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome do Serviço</Label>
                    <Input
                      value={newService.service_name || ''}
                      onChange={(e) => setNewService({...newService, service_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={newService.description || ''}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Preço Base (R$)</Label>
                    <Input
                      type="number"
                      value={newService.base_price || ''}
                      onChange={(e) => setNewService({...newService, base_price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Duração Estimada (dias)</Label>
                    <Input
                      type="number"
                      value={newService.estimated_duration || ''}
                      onChange={(e) => setNewService({...newService, estimated_duration: Number(e.target.value)})}
                    />
                  </div>
                  <Button onClick={handleAddService} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {service.service_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      {service.base_price && (
                        <p className="text-sm font-semibold">
                          R$ {service.base_price.toLocaleString('pt-BR')}
                        </p>
                      )}
                      {service.estimated_duration && (
                        <p className="text-xs text-muted-foreground">
                          {service.estimated_duration} dias
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {services.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum serviço adicionado ainda
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas e Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{professional.rating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">
                      {professional.total_reviews} avaliações
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Suas avaliações e estatísticas detalhadas aparecerão aqui conforme você completa projetos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}