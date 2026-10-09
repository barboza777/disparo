ALTER TABLE public.admin_settings
  ADD COLUMN warning_banner_text text NOT NULL DEFAULT '',
  ADD COLUMN attention_title text NOT NULL DEFAULT 'ATENÇÃO:';