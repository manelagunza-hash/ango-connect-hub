import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';

// Import dashboard components
import { ClientRequests } from '@/components/client/ClientRequests';
import { ClientProposals } from '@/components/client/ClientProposals';
import { ClientSearch } from '@/components/client/ClientSearch';
import { ClientConversations } from '@/components/client/ClientConversations';
import { ClientHistory } from '@/components/client/ClientHistory';
import { ProfessionalOpportunities } from '@/components/professional/ProfessionalOpportunities';
import { ProfessionalProposals } from '@/components/professional/ProfessionalProposals';
import { ProfessionalJobs } from '@/components/professional/ProfessionalJobs';
import { ProfessionalProfile } from '@/components/professional/ProfessionalProfile';
import { ProfessionalConversations } from '@/components/professional/ProfessionalConversations';
import { ProfessionalDashboardStats } from '@/components/professional/ProfessionalDashboardStats';
import Profile from '@/pages/Profile';

export function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isProfessional, isClient } = useRole();
  
  // Get the current section from URL
  const currentSection = location.pathname.split('/dashboard/')[1] || 'default';

  // Render content based on current section and user role
  const renderContent = () => {
    if (isProfessional) {
      switch (currentSection) {
        case 'opportunities':
          return <ProfessionalOpportunities />;
        case 'my-proposals':
          return <ProfessionalProposals />;
        case 'active-jobs':
          return <ProfessionalJobs />;
        case 'conversations':
          return <ProfessionalConversations />;
        case 'profile':
          return <ProfessionalProfile />;
        case 'stats':
          return <ProfessionalDashboardStats />;
        default:
          return <ProfessionalDashboardStats />;
      }
    } else if (isClient) {
      switch (currentSection) {
        case 'requests':
          return <ClientRequests />;
        case 'search':
          return <ClientSearch />;
        case 'proposals':
          return <ClientProposals />;
        case 'conversations':
          return <ClientConversations />;
        case 'history':
          return <ClientHistory />;
        default:
          return <ClientRequests />;
      }
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      {renderContent()}
    </div>
  );
}