-- ============================================
-- WORKTRAV — Migración: Compañías
-- Pegar en el SQL Editor de Supabase
-- ============================================

-- Agregar campo precio_rango a companies
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS precio_rango TEXT CHECK (precio_rango IN ('economico', 'medio', 'premium'));

-- Insertar compañías iniciales conocidas de LATAM
INSERT INTO public.companies (nombre, pais, website, descripcion, precio_rango) VALUES
  ('STS Work & Travel', 'Argentina', 'https://www.sts.com.ar', 'Empresa argentina líder en programas W&T para resorts de ski en USA. Acompañamiento completo en español desde la visa hasta el trabajo.', 'economico'),
  ('WorldConnect', 'Argentina', 'https://www.worldconnect.com.ar', 'Agencia argentina con programas W&T, au pair y trainee en USA. Buena atención y precios accesibles.', 'economico'),
  ('STB Student Travel Bureau', 'Brasil', 'https://www.stb.com.br', 'Una de las agencias de intercambio más grandes de Brasil. Programas W&T en resorts de ski con soporte en portugués.', 'medio'),
  ('CIE Intercâmbio', 'Brasil', 'https://www.cie.com.br', 'Agencia brasileña con amplia experiencia en programas Work & Travel USA. Atención personalizada.', 'medio'),
  ('WISE Intercâmbio', 'Brasil', 'https://www.wiseintercambio.com.br', 'Especialistas brasileños en W&T para ski resorts en USA. Soporte durante toda la temporada.', 'economico')
ON CONFLICT DO NOTHING;
