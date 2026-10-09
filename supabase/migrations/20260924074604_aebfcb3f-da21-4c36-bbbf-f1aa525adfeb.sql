ALTER TABLE public.admin_settings
ADD COLUMN banner_primary_path text NOT NULL DEFAULT '',
ADD COLUMN banner_secondary_path text NOT NULL DEFAULT '',
ADD COLUMN footer_contact_title text NOT NULL DEFAULT '',
ADD COLUMN footer_contact_text text NOT NULL DEFAULT '',
ADD COLUMN footer_policy_one_label text NOT NULL DEFAULT '',
ADD COLUMN footer_policy_one_url text NOT NULL DEFAULT '',
ADD COLUMN footer_policy_two_label text NOT NULL DEFAULT '',
ADD COLUMN footer_policy_two_url text NOT NULL DEFAULT '',
ADD COLUMN footer_copyright text NOT NULL DEFAULT '';