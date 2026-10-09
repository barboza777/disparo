ALTER TABLE public.admin_settings
ADD COLUMN header_logo_path text NOT NULL DEFAULT '';

CREATE POLICY "Admins can view site branding"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'site-branding'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can upload site branding"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-branding'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update site branding"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'site-branding'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'site-branding'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete site branding"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'site-branding'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);