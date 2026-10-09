DROP POLICY "Admins can view roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY "Admins can create settings" ON public.admin_settings;
CREATE POLICY "Admins can create settings"
ON public.admin_settings FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

DROP POLICY "Admins can update settings" ON public.admin_settings;
CREATE POLICY "Admins can update settings"
ON public.admin_settings FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

DROP FUNCTION public.has_role(uuid, public.app_role);