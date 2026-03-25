-- Migración v2: empresa organizadora
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS empresa_nombre TEXT;
