-- FASE 1: Tabelas para Perfil Profissional Completo

-- Tabela para portfólio
CREATE TABLE public.professional_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_portfolio ENABLE ROW LEVEL SECURITY;

-- RLS Policies para portfolio
CREATE POLICY "Portfolio é visível por todos"
  ON public.professional_portfolio
  FOR SELECT
  USING (true);

CREATE POLICY "Profissionais podem criar seu portfólio"
  ON public.professional_portfolio
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_portfolio.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem atualizar seu portfólio"
  ON public.professional_portfolio
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_portfolio.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem deletar seu portfólio"
  ON public.professional_portfolio
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_portfolio.professional_id
      AND p.user_id = auth.uid()
    )
  );

-- Tabela para certificações
CREATE TABLE public.professional_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  certificate_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies para certificações
CREATE POLICY "Certificações são visíveis por todos"
  ON public.professional_certifications
  FOR SELECT
  USING (true);

CREATE POLICY "Profissionais podem criar suas certificações"
  ON public.professional_certifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_certifications.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem atualizar suas certificações"
  ON public.professional_certifications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_certifications.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem deletar suas certificações"
  ON public.professional_certifications
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_certifications.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem verificar certificações"
  ON public.professional_certifications
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Tabela para serviços oferecidos
CREATE TABLE public.professional_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC,
  estimated_duration INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies para serviços
CREATE POLICY "Serviços ativos são visíveis por todos"
  ON public.professional_services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Profissionais podem criar seus serviços"
  ON public.professional_services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_services.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem atualizar seus serviços"
  ON public.professional_services
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_services.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Profissionais podem deletar seus serviços"
  ON public.professional_services
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_services.professional_id
      AND p.user_id = auth.uid()
    )
  );

-- Triggers para updated_at
CREATE TRIGGER update_professional_portfolio_updated_at
  BEFORE UPDATE ON public.professional_portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_certifications_updated_at
  BEFORE UPDATE ON public.professional_certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_services_updated_at
  BEFORE UPDATE ON public.professional_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();