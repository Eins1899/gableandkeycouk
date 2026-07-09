ALTER TABLE public.estimate_submissions
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS bedrooms text,
  ADD COLUMN IF NOT EXISTS property_type text,
  ADD COLUMN IF NOT EXISTS notes text;