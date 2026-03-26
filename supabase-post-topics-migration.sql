-- Add topic categorization to posts for better filtering by resort context
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS topic TEXT NOT NULL DEFAULT 'general';

-- Keep topics constrained to known values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'posts_topic_check'
  ) THEN
    ALTER TABLE public.posts
      ADD CONSTRAINT posts_topic_check
      CHECK (topic IN ('general', 'housing', 'job', 'mountain', 'company', 'tips'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS posts_resort_topic_created_idx
  ON public.posts(resort_id, topic, created_at DESC);
