-- ============================================
-- WORKTRAV — Migración: Compañías
-- Pegar en el SQL Editor de Supabase
-- ============================================

-- Agregar campo precio_rango a companies
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS precio_rango TEXT CHECK (precio_rango IN ('economico', 'medio', 'premium'));

-- Insertar compañías iniciales conocidas
INSERT INTO public.companies (nombre, pais, website, descripcion, precio_rango) VALUES
  ('CIEE Work & Travel', 'USA', 'https://www.ciee.org', 'Una de las organizaciones de intercambio más grandes del mundo. Programa W&T con soporte completo.', 'medio'),
  ('AYUSA', 'USA', 'https://www.ayusa.org', 'Programa Work & Travel USA con placement directo en resorts y soporte en español.', 'medio'),
  ('Intrax Work & Travel', 'USA', 'https://www.intraxinc.com', 'Programa oficial J-1 con amplia red de empleadores en resorts de ski.', 'medio'),
  ('STS Work & Travel', 'Argentina', 'https://www.sts.com.ar', 'Empresa argentina líder en programas W&T para resorts de ski en USA. Acompañamiento en español.', 'economico'),
  ('WorldConnect', 'Argentina', 'https://www.worldconnect.com.ar', 'Agencia argentina con programas W&T, au pair y trainee en USA.', 'economico'),
  ('Global Work & Travel', 'Australia', 'https://www.globalworkandtravel.com', 'Plataforma global con programas W&T en USA, Canadá y más.', 'premium'),
  ('InterExchange', 'USA', 'https://www.interexchange.org', 'Organización sin fines de lucro con programas J-1 en ski resorts.', 'economico')
ON CONFLICT DO NOTHING;
