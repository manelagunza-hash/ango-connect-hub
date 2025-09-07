import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type UserRole = 'admin' | 'client' | 'professional';

interface RoleContextType {
  userRole: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isProfessional: boolean;
  assignRole: (role: UserRole) => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadUserRole();
    } else {
      setUserRole(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserRole = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        // Se não encontrar role, assume 'client' como padrão
        if (error.code === 'PGRST116') {
          await assignRole('client');
        } else {
          throw error;
        }
      } else if (data) {
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error('Erro ao carregar role do usuário:', error);
      // Em caso de erro, assume 'client' como padrão
      setUserRole('client');
    } finally {
      setIsLoading(false);
    }
  };

  const assignRole = async (role: UserRole) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role
        });
      
      if (error) throw error;
      
      setUserRole(role);
    } catch (error) {
      console.error('Erro ao atribuir role:', error);
      throw error;
    }
  };

  return (
    <RoleContext.Provider value={{ 
      userRole,
      isLoading,
      isAdmin: userRole === 'admin',
      isClient: userRole === 'client',
      isProfessional: userRole === 'professional',
      assignRole
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole deve ser usado dentro de um RoleProvider');
  }
  return context;
};