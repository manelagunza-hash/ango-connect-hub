
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export type SubscriptionPlan = 'basic' | 'premium' | 'professional';

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  isLoading: boolean;
  isPremium: boolean;
  isProfessional: boolean;
  purchasePlan: (plan: SubscriptionPlan) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('basic');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadUserSubscription();
    } else {
      // Reset to basic if no user is logged in
      setCurrentPlan('basic');
      setIsLoading(false);
    }
  }, [user]);

  const loadUserSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Buscar dados de assinatura do usuário
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        // Se não encontrar assinatura, assume 'basic'
        if (error.code === 'PGRST116') {
          setCurrentPlan('basic');
        } else {
          throw error;
        }
      } else if (data) {
        setCurrentPlan(data.plan as SubscriptionPlan);
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      toast.error('Não foi possível carregar informações da assinatura');
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePlan = async (plan: SubscriptionPlan) => {
    try {
      if (!user) {
        toast.error('Faça login para assinar um plano');
        return;
      }

      setIsLoading(true);
      
      // Simular um processo de pagamento aqui - em produção, você usaria Stripe ou outra plataforma
      // Após o "pagamento" bem sucedido, atualizar o plano do usuário
      
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          plan: plan,
          active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias à frente
        });
      
      if (error) throw error;
      
      setCurrentPlan(plan);
      toast.success(`Plano ${plan} ativado com sucesso!`);
    } catch (error: any) {
      console.error('Erro ao processar assinatura:', error);
      toast.error(`Erro ao processar sua assinatura: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      currentPlan,
      isLoading,
      isPremium: currentPlan === 'premium' || currentPlan === 'professional',
      isProfessional: currentPlan === 'professional',
      purchasePlan
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
};
