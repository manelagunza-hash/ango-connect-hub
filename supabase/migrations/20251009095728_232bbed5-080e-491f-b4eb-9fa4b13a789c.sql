-- Create payments table for financial tracking
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('dinheiro', 'transferencia', 'multicaixa', 'outro')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Profissionais podem ver seus próprios pagamentos"
  ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = payments.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem criar seus pagamentos"
  ON public.payments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = payments.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem atualizar seus pagamentos"
  ON public.payments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = payments.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem ver todos os pagamentos"
  ON public.payments
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins podem gerenciar todos os pagamentos"
  ON public.payments
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_payments_professional_id ON public.payments(professional_id);
CREATE INDEX idx_payments_service_request_id ON public.payments(service_request_id);
CREATE INDEX idx_payments_payment_date ON public.payments(payment_date);
CREATE INDEX idx_payments_status ON public.payments(status);