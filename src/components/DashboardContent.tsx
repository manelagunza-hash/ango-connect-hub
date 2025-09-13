import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';

// Import existing dashboard components
import ClientDashboard from '@/pages/ClientDashboard';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';

export function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isProfessional, isClient } = useRole();
  
  // Get the current tab from URL params
  const urlParams = new URLSearchParams(location.search);
  const currentTab = urlParams.get('tab') || (isProfessional ? 'opportunities' : 'requests');

  // Header with trigger and actions
  const renderHeader = () => (
    <div className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isProfessional ? 'Dashboard Profissional' : 'Dashboard Cliente'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus {isProfessional ? 'serviços e propostas' : 'projetos e solicitações'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          {isClient && (
            <Button onClick={() => navigate('/service-request')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Main content based on user role and current tab
  const renderContent = () => {
    if (isProfessional) {
      return <ProfessionalDashboard />;
    } else if (isClient) {
      return <ClientDashboard />;
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {renderHeader()}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}