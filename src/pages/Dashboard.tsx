import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardContent } from '@/components/DashboardContent';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, isLoading: roleLoading } = useRole();

  // Mostrar loading enquanto carrega
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirecionar se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirecionar se não tiver role definido
  if (!userRole) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;