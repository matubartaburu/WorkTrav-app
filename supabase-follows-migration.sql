-- User follows (social graph)
CREATE TABLE IF NOT EXISTS public.user_follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT user_follows_no_self_follow CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS user_follows_follower_idx ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS user_follows_following_idx ON public.user_follows(following_id);

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Read follows publicly (needed to show follow state and future follower counts)
DROP POLICY IF EXISTS "User follows are public" ON public.user_follows;
CREATE POLICY "User follows are public"
ON public.user_follows
FOR SELECT
USING (true);

-- Users can only follow as themselves
DROP POLICY IF EXISTS "Users can follow" ON public.user_follows;
CREATE POLICY "Users can follow"
ON public.user_follows
FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- Users can only unfollow their own follows
DROP POLICY IF EXISTS "Users can unfollow" ON public.user_follows;
CREATE POLICY "Users can unfollow"
ON public.user_follows
FOR DELETE
USING (auth.uid() = follower_id);
