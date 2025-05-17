
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresSubscription?: 'premium' | 'professional';
}

const ProtectedRoute = ({ children, requiresSubscription }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  // Se ainda estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se precisar de verificação de assinatura, implementar aqui com o useSubscription
  // (Como esse componente ficaria complexo, é melhor criar uma lógica separada nas próprias páginas para isso)

  // Se estiver autenticado, renderiza os filhos
  return <>{children}</>;
};

export default ProtectedRoute;
