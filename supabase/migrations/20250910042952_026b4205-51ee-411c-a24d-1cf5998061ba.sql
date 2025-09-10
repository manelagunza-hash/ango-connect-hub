-- Criar tabela de propostas
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  client_id UUID NOT NULL,
  price NUMERIC NOT NULL,
  message TEXT,
  estimated_duration INTEGER, -- em horas
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para propostas
CREATE POLICY "Clientes podem ver propostas das suas solicitações"
ON public.proposals
FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Profissionais podem ver suas propostas"
ON public.proposals
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM professionals p 
  WHERE p.id = proposals.professional_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Profissionais podem criar propostas"
ON public.proposals
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM professionals p 
  WHERE p.id = proposals.professional_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Clientes podem atualizar status das propostas"
ON public.proposals
FOR UPDATE
USING (auth.uid() = client_id);

CREATE POLICY "Profissionais podem atualizar suas propostas"
ON public.proposals
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM professionals p 
  WHERE p.id = proposals.professional_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Admins podem gerenciar todas as propostas"
ON public.proposals
FOR ALL
USING (has_role(auth.uid(), 'admin'::user_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar novos status para service_requests
ALTER TABLE public.service_requests 
DROP CONSTRAINT IF EXISTS service_requests_status_check;

ALTER TABLE public.service_requests 
ADD CONSTRAINT service_requests_status_check 
CHECK (status IN ('pending', 'proposta_enviada', 'contratado', 'em_execucao', 'completed', 'cancelled'));

-- Criar índices para performance
CREATE INDEX idx_proposals_service_request_id ON public.proposals(service_request_id);
CREATE INDEX idx_proposals_professional_id ON public.proposals(professional_id);
CREATE INDEX idx_proposals_client_id ON public.proposals(client_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);