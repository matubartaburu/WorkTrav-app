# SnowRoute — Work & Travel Community

## Setup en 5 pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear proyecto en Supabase
- Ir a [supabase.com](https://supabase.com) y crear un proyecto nuevo
- Copiar la URL y la Anon Key

### 3. Configurar variables de entorno
```bash
cp .env.local.example .env.local
# Editar .env.local con tus keys de Supabase
```

### 4. Crear las tablas en Supabase
- Ir a SQL Editor en Supabase
- Pegar y ejecutar el contenido de `supabase-schema.sql`

### 5. Correr el proyecto
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Estructura del proyecto

```
app/
  page.js              → Landing page pública
  login/page.js        → Login
  register/page.js     → Registro
  (protected)/
    layout.js          → Layout con navbar (requiere auth)
    feed/page.js       → Feed de experiencias
    resorts/page.js    → Listado de resorts
    profile/page.js    → Perfil del usuario
    new-post/page.js   → Crear nueva experiencia

components/
  layout/Navbar.jsx    → Barra de navegación
  layout/BottomNav.jsx → Navegación mobile
  feed/PostCard.jsx    → Card de post

lib/
  supabase.js          → Cliente Supabase (browser)
  supabase-server.js   → Cliente Supabase (server)

supabase-schema.sql    → Tablas + RLS + datos iniciales
```

## Stack
- **Next.js 14** (App Router, JavaScript)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tailwind CSS** (dark mode, design system custom)
- **lucide-react** (íconos)
