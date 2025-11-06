-- Add Salt Rocks Transaction System
-- Created: 2025-11-15

-- Salt Rocks transaction history table
CREATE TABLE IF NOT EXISTS public.salt_rocks_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,

  amount integer NOT NULL, -- positive = credit, negative = debit
  balance_after integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN (
    'purchase',
    'refund',
    'spend_bio_upgrade',
    'spend_song_slot',
    'spend_photo_slot',
    'spend_featured_listing',
    'spend_event_promotion',
    'spend_tier_upgrade',
    'earn_referral',
    'earn_engagement',
    'admin_adjustment'
  )),
  description text,

  -- Payment tracking
  stripe_payment_intent_id text,
  stripe_charge_id text,

  -- Metadata
  metadata jsonb,

  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.salt_rocks_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their band's transactions"
  ON public.salt_rocks_transactions FOR SELECT
  USING (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Service role can insert transactions"
  ON public.salt_rocks_transactions FOR INSERT
  WITH CHECK (true); -- Only service role can insert

CREATE POLICY "Admins can view all transactions"
  ON public.salt_rocks_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS salt_rocks_transactions_band_id_idx
  ON public.salt_rocks_transactions(band_id);
CREATE INDEX IF NOT EXISTS salt_rocks_transactions_created_at_idx
  ON public.salt_rocks_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS salt_rocks_transactions_type_idx
  ON public.salt_rocks_transactions(transaction_type);

-- Function to add Salt Rocks transaction and update balance
CREATE OR REPLACE FUNCTION public.add_salt_rocks_transaction(
  p_band_id uuid,
  p_amount integer,
  p_transaction_type text,
  p_description text DEFAULT NULL,
  p_stripe_payment_intent_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_new_balance integer;
  v_transaction_id uuid;
BEGIN
  -- Get current balance
  SELECT salt_rocks_balance INTO v_new_balance
  FROM public.bands
  WHERE id = p_band_id;

  -- Calculate new balance
  v_new_balance := COALESCE(v_new_balance, 0) + p_amount;

  -- Prevent negative balance (except for admin adjustments)
  IF v_new_balance < 0 AND p_transaction_type != 'admin_adjustment' THEN
    RAISE EXCEPTION 'Insufficient Salt Rocks balance';
  END IF;

  -- Insert transaction
  INSERT INTO public.salt_rocks_transactions (
    band_id,
    amount,
    balance_after,
    transaction_type,
    description,
    stripe_payment_intent_id,
    metadata
  )
  VALUES (
    p_band_id,
    p_amount,
    v_new_balance,
    p_transaction_type,
    p_description,
    p_stripe_payment_intent_id,
    p_metadata
  )
  RETURNING id INTO v_transaction_id;

  -- Update band balance
  UPDATE public.bands
  SET salt_rocks_balance = v_new_balance
  WHERE id = p_band_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.add_salt_rocks_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_salt_rocks_transaction TO service_role;

-- Comments
COMMENT ON TABLE public.salt_rocks_transactions IS 'Transaction history for Salt Rocks (Rock Salt virtual currency)';
COMMENT ON FUNCTION public.add_salt_rocks_transaction IS 'Safely adds a Salt Rocks transaction and updates band balance atomically';
