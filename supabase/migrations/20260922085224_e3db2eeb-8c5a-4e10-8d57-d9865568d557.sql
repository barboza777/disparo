CREATE TABLE public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  txid text NOT NULL UNIQUE,
  amount_in_cents integer NOT NULL CHECK (amount_in_cents > 0),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_document text,
  customer_ip text,
  tracking_parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
  gateway_status text NOT NULL DEFAULT 'pending',
  utmify_pending_sent_at timestamptz,
  utmify_paid_sent_at timestamptz,
  last_checked_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.payment_orders TO service_role;

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX payment_orders_pending_reconciliation_idx
  ON public.payment_orders (utmify_paid_sent_at, last_checked_at)
  WHERE utmify_paid_sent_at IS NULL;

CREATE OR REPLACE FUNCTION public.update_payment_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_payment_orders_updated_at
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_payment_orders_updated_at();