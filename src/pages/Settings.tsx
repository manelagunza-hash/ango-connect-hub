import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Bell, Clock, Shield, CreditCard, User } from 'lucide-react';

interface ProfessionalSettings {
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newOpportunities: boolean;
    proposalUpdates: boolean;
    messages: boolean;
    reviews: boolean;
  };
  availability_schedule: {
    [key: string]: {
      available: boolean;
      start: string;
      end: string;
    };
  };
  privacy_settings: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showRating: boolean;
    showReviews: boolean;
  };
  payment_methods: any[];
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ProfessionalSettings | null>(null);
  const [professionalData, setProfessionalData] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfessionalData(data);
      setSettings({
        notification_preferences: data.notification_preferences as any,
        availability_schedule: data.availability_schedule as any,
        privacy_settings: data.privacy_settings as any,
        payment_methods: data.payment_methods as any,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user || !settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('professionals')
        .update({
          notification_preferences: settings.notification_preferences,
          availability_schedule: settings.availability_schedule,
          privacy_settings: settings.privacy_settings,
          payment_methods: settings.payment_methods,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationPref = (key: string, value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notification_preferences: {
        ...settings.notification_preferences,
        [key]: value,
      },
    });
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      privacy_settings: {
        ...settings.privacy_settings,
        [key]: value,
      },
    });
  };

  const updateAvailability = (day: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      availability_schedule: {
        ...settings.availability_schedule,
        [day]: {
          ...settings.availability_schedule[day],
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) return null;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames: { [key: string]: string } = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Clock className="h-4 w-4 mr-2" />
            Disponibilidade
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações profissionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={professionalData?.name || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={professionalData?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={professionalData?.phone || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Profissão</Label>
                  <Input value={professionalData?.profession || ''} disabled />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Para alterar essas informações, acesse a página de perfil profissional.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>Escolha como deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Canais de Notificação</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email</Label>
                    <Switch
                      checked={settings.notification_preferences.email}
                      onCheckedChange={(checked) => updateNotificationPref('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push (Navegador)</Label>
                    <Switch
                      checked={settings.notification_preferences.push}
                      onCheckedChange={(checked) => updateNotificationPref('push', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>SMS</Label>
                    <Switch
                      checked={settings.notification_preferences.sms}
                      onCheckedChange={(checked) => updateNotificationPref('sms', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Tipos de Notificação</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Novas Oportunidades</Label>
                    <Switch
                      checked={settings.notification_preferences.newOpportunities}
                      onCheckedChange={(checked) => updateNotificationPref('newOpportunities', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Atualizações de Propostas</Label>
                    <Switch
                      checked={settings.notification_preferences.proposalUpdates}
                      onCheckedChange={(checked) => updateNotificationPref('proposalUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mensagens</Label>
                    <Switch
                      checked={settings.notification_preferences.messages}
                      onCheckedChange={(checked) => updateNotificationPref('messages', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Avaliações</Label>
                    <Switch
                      checked={settings.notification_preferences.reviews}
                      onCheckedChange={(checked) => updateNotificationPref('reviews', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveSettings} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Preferências'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Disponibilidade</CardTitle>
              <CardDescription>Configure seus horários de trabalho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-32">
                    <Label>{dayNames[day]}</Label>
                  </div>
                  <Switch
                    checked={settings.availability_schedule[day]?.available}
                    onCheckedChange={(checked) => updateAvailability(day, 'available', checked)}
                  />
                  {settings.availability_schedule[day]?.available && (
                    <>
                      <Input
                        type="time"
                        value={settings.availability_schedule[day]?.start || '09:00'}
                        onChange={(e) => updateAvailability(day, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span>até</span>
                      <Input
                        type="time"
                        value={settings.availability_schedule[day]?.end || '18:00'}
                        onChange={(e) => updateAvailability(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              ))}
              <Button onClick={saveSettings} disabled={saving} className="mt-4">
                {saving ? 'Salvando...' : 'Salvar Disponibilidade'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>Controle o que é visível no seu perfil público</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Mostrar Email</Label>
                  <Switch
                    checked={settings.privacy_settings.showEmail}
                    onCheckedChange={(checked) => updatePrivacySetting('showEmail', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Mostrar Telefone</Label>
                  <Switch
                    checked={settings.privacy_settings.showPhone}
                    onCheckedChange={(checked) => updatePrivacySetting('showPhone', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Mostrar Localização</Label>
                  <Switch
                    checked={settings.privacy_settings.showLocation}
                    onCheckedChange={(checked) => updatePrivacySetting('showLocation', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Mostrar Avaliação</Label>
                  <Switch
                    checked={settings.privacy_settings.showRating}
                    onCheckedChange={(checked) => updatePrivacySetting('showRating', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Mostrar Avaliações</Label>
                  <Switch
                    checked={settings.privacy_settings.showReviews}
                    onCheckedChange={(checked) => updatePrivacySetting('showReviews', checked)}
                  />
                </div>
              </div>
              <Button onClick={saveSettings} disabled={saving} className="mt-4">
                {saving ? 'Salvando...' : 'Salvar Privacidade'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>Gerencie suas formas de recebimento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure seus métodos de pagamento preferidos para receber pelos serviços prestados.
              </p>
              <Button className="mt-4" variant="outline">
                Adicionar Método de Pagamento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Alterar Senha</Button>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Excluir Conta</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Uma vez excluída, sua conta não poderá ser recuperada.
                </p>
                <Button variant="destructive">Excluir Minha Conta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
