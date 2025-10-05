-- Fase 10: Adicionar campos de configuração à tabela professionals
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false, "newOpportunities": true, "proposalUpdates": true, "messages": true, "reviews": true}'::jsonb,
ADD COLUMN IF NOT EXISTS availability_schedule JSONB DEFAULT '{"monday": {"available": true, "start": "09:00", "end": "18:00"}, "tuesday": {"available": true, "start": "09:00", "end": "18:00"}, "wednesday": {"available": true, "start": "09:00", "end": "18:00"}, "thursday": {"available": true, "start": "09:00", "end": "18:00"}, "friday": {"available": true, "start": "09:00", "end": "18:00"}, "saturday": {"available": false, "start": "09:00", "end": "18:00"}, "sunday": {"available": false, "start": "09:00", "end": "18:00"}}'::jsonb,
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"showEmail": false, "showPhone": true, "showLocation": true, "showRating": true, "showReviews": true}'::jsonb,
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Fase 8: Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('opportunity', 'proposal', 'message', 'review', 'payment', 'system')),
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies para notificações
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Função para criar notificação de nova proposta
CREATE OR REPLACE FUNCTION public.notify_new_proposal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notificar o cliente
  INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
  VALUES (
    NEW.client_id,
    'Nova Proposta Recebida',
    'Você recebeu uma nova proposta para sua solicitação de serviço',
    'proposal',
    NEW.id,
    'proposal'
  );
  RETURN NEW;
END;
$$;

-- Trigger para notificação de nova proposta
DROP TRIGGER IF EXISTS on_proposal_created ON public.proposals;
CREATE TRIGGER on_proposal_created
AFTER INSERT ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_proposal();

-- Função para criar notificação de proposta aceita
CREATE OR REPLACE FUNCTION public.notify_proposal_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    -- Notificar o profissional através do professionals table
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    SELECT 
      p.user_id,
      'Proposta Aceita!',
      'Sua proposta foi aceita pelo cliente',
      'proposal',
      NEW.id,
      'proposal'
    FROM public.professionals p
    WHERE p.id = NEW.professional_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger para notificação de proposta aceita
DROP TRIGGER IF EXISTS on_proposal_status_changed ON public.proposals;
CREATE TRIGGER on_proposal_status_changed
AFTER UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.notify_proposal_accepted();

-- Função para criar notificação de nova mensagem
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  participant UUID;
BEGIN
  -- Notificar todos os participantes exceto o remetente
  FOR participant IN 
    SELECT UNNEST(c.participant_ids)
    FROM public.conversations c
    WHERE c.id = NEW.conversation_id
    AND UNNEST(c.participant_ids) != NEW.sender_id
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    VALUES (
      participant,
      'Nova Mensagem',
      'Você recebeu uma nova mensagem',
      'message',
      NEW.conversation_id,
      'conversation'
    );
  END LOOP;
  RETURN NEW;
END;
$$;

-- Trigger para notificação de nova mensagem
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_message();

-- Função para criar notificação de nova avaliação
CREATE OR REPLACE FUNCTION public.notify_new_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notificar o profissional através do professionals table
  INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
  SELECT 
    p.user_id,
    'Nova Avaliação Recebida',
    'Você recebeu uma nova avaliação de ' || NEW.rating || ' estrelas',
    'review',
    NEW.id,
    'review'
  FROM public.professionals p
  WHERE p.id = NEW.professional_id;
  RETURN NEW;
END;
$$;

-- Trigger para notificação de nova avaliação
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_review();

-- Habilitar realtime para notificações
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;