-- ============================================
-- WORKTRAV — Schema de Base de Datos
-- Pegar esto en el SQL Editor de Supabase
-- ============================================

-- Tabla de usuarios (extiende auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  pais TEXT,
  universidad TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de resorts
CREATE TABLE public.resorts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  estado_usa TEXT NOT NULL,
  latitud DECIMAL(10, 7),
  longitud DECIMAL(10, 7),
  descripcion TEXT,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de posts / experiencias
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  resort_id UUID REFERENCES public.resorts(id) ON DELETE SET NULL,
  contenido TEXT NOT NULL,
  imagen_url TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de empresas organizadoras
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  pais TEXT,
  website TEXT,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews de empresas
CREATE TABLE public.company_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comentario TEXT,
  anio INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews de trabajos
CREATE TABLE public.job_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  resort_id UUID REFERENCES public.resorts(id) ON DELETE CASCADE,
  titulo_trabajo TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  salario_aprox DECIMAL(10,2),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_reviews ENABLE ROW LEVEL SECURITY;

-- Users: cualquiera puede leer, solo el dueño edita
CREATE POLICY "Users son públicos" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users editan su perfil" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insertan su perfil" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Resorts: solo lectura pública
CREATE POLICY "Resorts son públicos" ON public.resorts FOR SELECT USING (true);

-- Posts: lectura pública, escritura autenticada
CREATE POLICY "Posts son públicos" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados crean posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios editan sus posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuarios borran sus posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Companies: lectura pública
CREATE POLICY "Companies son públicas" ON public.companies FOR SELECT USING (true);

-- Reviews: lectura pública, escritura autenticada
CREATE POLICY "Company reviews públicas" ON public.company_reviews FOR SELECT USING (true);
CREATE POLICY "Usuarios crean company reviews" ON public.company_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Job reviews públicas" ON public.job_reviews FOR SELECT USING (true);
CREATE POLICY "Usuarios crean job reviews" ON public.job_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Datos iniciales — Resorts principales USA
-- ============================================

INSERT INTO public.resorts (nombre, estado_usa, latitud, longitud) VALUES
  ('Vail', 'Colorado', 39.6433, -106.3781),
  ('Aspen Snowmass', 'Colorado', 39.1911, -106.8175),
  ('Breckenridge', 'Colorado', 39.4803, -106.0666),
  ('Park City', 'Utah', 40.6461, -111.4980),
  ('Mammoth Mountain', 'California', 37.6308, -119.0326),
  ('Jackson Hole', 'Wyoming', 43.5875, -110.8279),
  ('Steamboat Springs', 'Colorado', 40.4850, -106.8317),
  ('Telluride', 'Colorado', 37.9375, -107.8123),
  ('Snowbird', 'Utah', 40.5830, -111.6513),
  ('Taos Ski Valley', 'New Mexico', 36.5952, -105.4472),
  ('Killington', 'Vermont', 43.6045, -72.8201),
  ('Stowe', 'Vermont', 44.5303, -72.7814),
  ('Big Sky', 'Montana', 45.2860, -111.4015),
  ('Sun Valley', 'Idaho', 43.6963, -114.3513),
  ('Whistler Blackcomb', 'British Columbia', 50.1163, -122.9574);
