-- Corrigir função para ter search_path seguro
CREATE OR REPLACE FUNCTION public.update_professional_rating()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.professionals
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE professional_id = NEW.professional_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE professional_id = NEW.professional_id)
  WHERE id = NEW.professional_id;
  RETURN NEW;
END;
$$;