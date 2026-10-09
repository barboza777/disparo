DROP POLICY "Public can read checkout settings" ON public.admin_settings;
REVOKE SELECT ON public.admin_settings FROM anon;

CREATE POLICY "Admins can read settings"
ON public.admin_settings FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));