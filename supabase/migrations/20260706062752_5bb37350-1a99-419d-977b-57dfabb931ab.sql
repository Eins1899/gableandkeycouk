
CREATE TABLE public.estimate_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.estimate_submissions TO service_role;
ALTER TABLE public.estimate_submissions ENABLE ROW LEVEL SECURITY;

-- No public policies: only service_role (server-side) can read/write.
CREATE INDEX estimate_submissions_created_at_idx ON public.estimate_submissions (created_at DESC);
CREATE INDEX estimate_submissions_ip_hash_idx ON public.estimate_submissions (ip_hash, created_at DESC);
