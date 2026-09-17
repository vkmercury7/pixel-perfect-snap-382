GRANT UPDATE (status, external_id) ON public.wallet_transactions TO authenticated;

CREATE POLICY "Users can create own pending PIX deposits"
ON public.wallet_transactions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND type = 'deposit'::public.wallet_transaction_type
  AND status = 'pending'::public.wallet_transaction_status
  AND external_id IS NULL
  AND amount_cents IN (1000, 2000, 3000, 4000, 5000, 10000, 20000, 50000, 100000)
);

CREATE POLICY "Users can update own pending PIX deposits"
ON public.wallet_transactions
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND type = 'deposit'::public.wallet_transaction_type
  AND status = 'pending'::public.wallet_transaction_status
)
WITH CHECK (
  auth.uid() = user_id
  AND type = 'deposit'::public.wallet_transaction_type
  AND status IN ('pending'::public.wallet_transaction_status, 'canceled'::public.wallet_transaction_status)
  AND amount_cents IN (1000, 2000, 3000, 4000, 5000, 10000, 20000, 50000, 100000)
);