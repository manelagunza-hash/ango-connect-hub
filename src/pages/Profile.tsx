
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, Clock, X, UserCircle, Settings, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Profile = () => {
  const { user, session, signOut } = useAuth();
  const { currentPlan } = useSubscription();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          phone: profileData.phone
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPlanBadgeColor = () => {
    switch (currentPlan) {
      case 'basic': return 'bg-gray-500';
      case 'premium': return 'bg-accent';
      case 'professional': return 'bg-primary';
      default: return 'bg-gray-500';
    }
  };

  const getPlanDisplayName = () => {
    switch (currentPlan) {
      case 'basic': return 'Básico';
      case 'premium': return 'Premium';
      case 'professional': return 'Profissional';
      default: return 'Básico';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container-custom">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Meu Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna da Esquerda - Informações do Perfil */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Meu Perfil</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-2xl bg-primary text-white">
                            {profileData.name ? profileData.name.substring(0, 2).toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-semibold">{profileData.name || 'Utilizador'}</h2>
                          <div className="flex items-center mt-2">
                            <Badge className={`${getPlanBadgeColor()} hover:${getPlanBadgeColor()}`}>
                              Plano {getPlanDisplayName()}
                            </Badge>
                            <Button variant="link" className="text-accent pl-2" asChild>
                              <a href="/premium">Atualizar</a>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={profileData.name}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            readOnly
                            disabled
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button type="submit" className="bg-accent hover:bg-accent-hover" disabled={isSaving}>
                        {isSaving ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                          </span>
                        ) : "Salvar Alterações"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Coluna da Direita - Plano e Opções */}
            <div>
              {/* Card do Plano */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Seu Plano</CardTitle>
                  <CardDescription>
                    Gerencie sua assinatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${
                    currentPlan === 'basic' 
                      ? 'bg-gray-100' 
                      : currentPlan === 'premium' 
                      ? 'bg-accent/10' 
                      : 'bg-primary/10'
                  }`}>
                    <h3 className="font-semibold text-lg">
                      Plano {getPlanDisplayName()}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {currentPlan === 'basic' 
                        ? 'Plano gratuito com funcionalidades limitadas.' 
                        : currentPlan === 'premium' 
                        ? 'Aproveite todos os recursos premium.' 
                        : 'Acesso completo para profissionais.'}
                    </p>
                    
                    {/* Lista de benefícios do plano atual */}
                    <ul className="mt-4 space-y-2">
                      {currentPlan === 'basic' ? (
                        <>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Acesso à pesquisa</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Visualização de perfis básicos</span>
                          </li>
                          <li className="flex items-center">
                            <X className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-400">Contato direto bloqueado</span>
                          </li>
                        </>
                      ) : currentPlan === 'premium' ? (
                        <>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Acesso ilimitado</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Contato direto com profissionais</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Suporte prioritário</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Destaque nos resultados</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Ferramentas de negócio</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Suporte especializado</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href="/premium">
                      {currentPlan === 'basic' ? 'Fazer Upgrade' : 'Gerenciar Assinatura'}
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              {/* Card de Opções da Conta */}
              <Card>
                <CardHeader>
                  <CardTitle>Opções da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/profile">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Meus Dados
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
