-- Criar sistema de roles para usuários
CREATE TYPE public.user_role AS ENUM ('admin', 'client', 'professional');

-- Criar tabela de roles dos usuários
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função de segurança para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir role de admin para teste (substituir pelo ID real do usuário admin)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000000', 'admin');

-- Atualizar políticas existentes para usar o sistema de roles

-- Políticas para service_requests - admins podem ver tudo
CREATE POLICY "Admins can view all service requests"
ON public.service_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all service requests"
ON public.service_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para professionals - admins podem ver e gerenciar tudo
CREATE POLICY "Admins can update all professionals"
ON public.professionals
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para conversations - admins podem ver todas
CREATE POLICY "Admins can view all conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para messages - admins podem ver e enviar mensagens
CREATE POLICY "Admins can view all messages"
ON public.messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can send messages to any conversation"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));