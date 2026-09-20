CREATE TYPE public.app_role AS ENUM ('owner');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

CREATE POLICY "Users can read own role"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "First user can claim owner role"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'owner'
  AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner')
);

CREATE TABLE public.trip_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  caption text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trip_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.trip_photos TO authenticated;
GRANT ALL ON public.trip_photos TO service_role;
ALTER TABLE public.trip_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view trip photo metadata"
ON public.trip_photos FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Owner can add trip photos"
ON public.trip_photos FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid() AND public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can update trip photos"
ON public.trip_photos FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can delete trip photos"
ON public.trip_photos FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Everyone can view trip photo files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'trip-photos');

CREATE POLICY "Owner can upload trip photo files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'trip-photos' AND public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can update trip photo files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'trip-photos' AND public.has_role(auth.uid(), 'owner'))
WITH CHECK (bucket_id = 'trip-photos' AND public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can delete trip photo files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'trip-photos' AND public.has_role(auth.uid(), 'owner'));