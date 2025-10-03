import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Search,
  MessageCircle,
  History,
  Briefcase,
  User,
  Settings,
  LogOut,
  Bell,
  PlusCircle,
  CheckCircle,
  LayoutDashboard,
} from 'lucide-react';

const clientMenuItems = [
  {
    title: 'Minhas Solicitações',
    url: '/dashboard/requests',
    icon: FileText,
  },
  {
    title: 'Buscar Profissionais',
    url: '/dashboard/search',
    icon: Search,
  },
  {
    title: 'Propostas Recebidas',
    url: '/dashboard/proposals',
    icon: PlusCircle,
  },
  {
    title: 'Conversas',
    url: '/dashboard/conversations',
    icon: MessageCircle,
  },
  {
    title: 'Histórico',
    url: '/dashboard/history',
    icon: History,
  },
];

const professionalMenuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard/stats',
    icon: LayoutDashboard,
  },
  {
    title: 'Oportunidades',
    url: '/dashboard/opportunities',
    icon: Briefcase,
  },
  {
    title: 'Minhas Propostas',
    url: '/dashboard/my-proposals',
    icon: FileText,
  },
  {
    title: 'Trabalhos Ativos',
    url: '/dashboard/active-jobs',
    icon: CheckCircle,
  },
  {
    title: 'Conversas',
    url: '/dashboard/conversations',
    icon: MessageCircle,
  },
  {
    title: 'Meu Perfil',
    url: '/dashboard/profile',
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { userRole, isProfessional, isClient } = useRole();
  const { user, signOut } = useAuth();
  
  const menuItems = isProfessional ? professionalMenuItems : clientMenuItems;
  
  const isActiveRoute = (url: string) => {
    return location.pathname === url;
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PA</span>
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">ProfissionalAO</h2>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {userRole === 'client' ? 'Cliente' : 'Profissional'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>
            {isProfessional ? 'Área Profissional' : 'Área do Cliente'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full ${isActiveRoute(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Geral
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/notifications" className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <span>Notificações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="h-8 w-8 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}