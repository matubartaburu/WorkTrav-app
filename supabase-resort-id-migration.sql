-- Add missing users.resort_id column and foreign key
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS resort_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_resort_id_fkey'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_resort_id_fkey
      FOREIGN KEY (resort_id)
      REFERENCES public.resorts(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS users_resort_id_idx ON public.users(resort_id);

-- Optional: set onboarding as complete for users that already have both required fields
UPDATE public.users
SET onboarding_completado = true
WHERE empresa_nombre IS NOT NULL
  AND trim(empresa_nombre) <> ''
  AND resort_id IS NOT NULL;
