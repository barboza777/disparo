ALTER TABLE public.payment_orders
ADD COLUMN utmify_paid_claimed_at timestamptz;

CREATE OR REPLACE FUNCTION public.claim_payment_order_for_utmify(_txid text)
RETURNS SETOF public.payment_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.payment_orders
  SET utmify_paid_claimed_at = now(), updated_at = now()
  WHERE txid = _txid
    AND utmify_paid_sent_at IS NULL
    AND (
      utmify_paid_claimed_at IS NULL
      OR utmify_paid_claimed_at < now() - interval '5 minutes'
    )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_payment_order_for_utmify(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_payment_order_for_utmify(text) TO service_role;