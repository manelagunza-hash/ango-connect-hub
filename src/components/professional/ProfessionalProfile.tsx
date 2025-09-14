import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Star, Edit, Save, X } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  email: string;
  profession: string;
  description?: string;
  location?: string;
  rating?: number;
  total_reviews?: number;
  hourly_rate?: number;
  phone?: string;
  is_available: boolean;
  is_verified: boolean;
}

export function ProfessionalProfile() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para edição
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    profession: '',
    description: '',
    location: '',
    hourly_rate: '',
    phone: '',
    is_available: true
  });

  useEffect(() => {
    loadProfessionalData();
  }, [user]);

  const loadProfessionalData = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      setProfessional(data);
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        profession: data.profession || '',
        description: data.description || '',
        location: data.location || '',
        hourly_rate: data.hourly_rate?.toString() || '',
        phone: data.phone || '',
        is_available: data.is_available
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil profissional');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('professionals')
        .update({
          name: editForm.name,
          email: editForm.email,
          profession: editForm.profession,
          description: editForm.description,
          location: editForm.location,
          hourly_rate: editForm.hourly_rate ? parseFloat(editForm.hourly_rate) : null,
          phone: editForm.phone,
          is_available: editForm.is_available
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
      loadProfessionalData();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (professional) {
      setEditForm({
        name: professional.name || '',
        email: professional.email || '',
        profession: professional.profession || '',
        description: professional.description || '',
        location: professional.location || '',
        hourly_rate: professional.hourly_rate?.toString() || '',
        phone: professional.phone || '',
        is_available: professional.is_available
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Perfil profissional não encontrado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações profissionais
          </p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Informações básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Suas informações de contato e profissão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                {editing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{professional.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                {editing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{professional.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="profession">Profissão</Label>
                {editing ? (
                  <Input
                    id="profession"
                    value={editForm.profession}
                    onChange={(e) => setEditForm({...editForm, profession: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{professional.profession}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{professional.phone || 'Não informado'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                {editing ? (
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{professional.location || 'Não informado'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="hourly_rate">Taxa por Hora (AOA)</Label>
                {editing ? (
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={editForm.hourly_rate}
                    onChange={(e) => setEditForm({...editForm, hourly_rate: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {professional.hourly_rate ? `AOA ${professional.hourly_rate.toLocaleString('pt-BR')}` : 'Não informado'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Descrição */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre Você</CardTitle>
            <CardDescription>
              Descreva sua experiência e habilidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="description">Descrição</Label>
            {editing ? (
              <Textarea
                id="description"
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Descreva sua experiência, habilidades e o que você oferece..."
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {professional.description || 'Nenhuma descrição adicionada'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Status e Avaliações */}
        <Card>
          <CardHeader>
            <CardTitle>Status e Avaliações</CardTitle>
            <CardDescription>
              Sua disponibilidade e feedback dos clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Disponível para trabalhos</Label>
                {editing ? (
                  <Switch
                    id="available"
                    checked={editForm.is_available}
                    onCheckedChange={(checked) => setEditForm({...editForm, is_available: checked})}
                  />
                ) : (
                  <Badge variant={professional.is_available ? 'default' : 'secondary'}>
                    {professional.is_available ? 'Disponível' : 'Indisponível'}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {professional.rating ? professional.rating.toFixed(1) : 'Sem avaliações'}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({professional.total_reviews || 0} avaliações)
                </span>
              </div>

              <div>
                <Badge variant={professional.is_verified ? 'default' : 'outline'}>
                  {professional.is_verified ? 'Verificado' : 'Não verificado'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}