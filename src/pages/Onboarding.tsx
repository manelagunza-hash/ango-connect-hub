import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<'client' | 'professional' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    try {
      setLoading(true);
      await assignRole(selectedRole);
      toast.success(`Perfil ${selectedRole === 'client' ? 'Cliente' : 'Profissional'} criado com sucesso!`);
      
      if (selectedRole === 'professional') {
        navigate('/professional-registration');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao definir role:', error);
      toast.error('Erro ao configurar seu perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Bem-vindo ao <span className="text-primary">ProfissionalAO</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Para começar, escolha como você gostaria de usar nossa plataforma:
            </p>
            <Badge variant="outline" className="text-sm">
              Você pode alterar isso depois nas configurações
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Cliente */}
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole === 'client' 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedRole('client')}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedRole === 'client' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Users size={32} />
                </div>
                <CardTitle className="text-2xl">Sou Cliente</CardTitle>
                <CardDescription className="text-lg">
                  Preciso contratar profissionais para resolver problemas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Postar solicitações de serviços
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Receber propostas de profissionais
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Pesquisar profissionais por categoria
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Gerenciar projetos e conversas
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Profissional */}
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole === 'professional' 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedRole('professional')}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedRole === 'professional' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <UserCheck size={32} />
                </div>
                <CardTitle className="text-2xl">Sou Profissional</CardTitle>
                <CardDescription className="text-lg">
                  Ofereço serviços e quero encontrar clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Ver oportunidades de trabalho
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Enviar propostas para clientes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Criar perfil profissional completo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Receber avaliações e construir reputação
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleRoleSelection}
              disabled={!selectedRole || loading}
              size="lg"
              className="min-w-48"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;