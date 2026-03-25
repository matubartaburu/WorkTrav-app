-- Migración: columnas para onboarding
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS edad INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS temporadas_hechas INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_completado BOOLEAN DEFAULT false;
