CREATE TYPE public.wallet_transaction_type AS ENUM ('deposit', 'withdrawal', 'bonus');
CREATE TYPE public.wallet_transaction_status AS ENUM ('pending', 'approved', 'rejected', 'canceled');
CREATE TYPE public.vip_tier AS ENUM ('bronze', 'silver', 'gold', 'diamond');
CREATE TYPE public.pix_key_type AS ENUM ('cpf', 'email', 'phone', 'random');

CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY,
  public_id text NOT NULL UNIQUE,
  cpf text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.wallets (
  user_id uuid PRIMARY KEY,
  balance_cents bigint NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  vip_tier public.vip_tier NOT NULL DEFAULT 'bronze',
  vip_progress_cents bigint NOT NULL DEFAULT 0 CHECK (vip_progress_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own wallet" ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type public.wallet_transaction_type NOT NULL,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  status public.wallet_transaction_status NOT NULL DEFAULT 'pending',
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions" ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can request withdrawals" ON public.wallet_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND type = 'withdrawal' AND status = 'pending' AND external_id IS NULL);

CREATE TABLE public.user_pix_keys (
  user_id uuid PRIMARY KEY,
  type public.pix_key_type NOT NULL,
  value text NOT NULL CHECK (char_length(trim(value)) > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_pix_keys TO authenticated;
GRANT ALL ON public.user_pix_keys TO service_role;
ALTER TABLE public.user_pix_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own PIX key" ON public.user_pix_keys FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own PIX key" ON public.user_pix_keys FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own PIX key" ON public.user_pix_keys FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
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

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER wallets_set_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER wallet_transactions_set_updated_at BEFORE UPDATE ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER user_pix_keys_set_updated_at BEFORE UPDATE ON public.user_pix_keys FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_public_id text;
  generated_public_id text;
BEGIN
  requested_public_id := NULLIF(trim(NEW.raw_user_meta_data ->> 'public_id'), '');
  generated_public_id := COALESCE(requested_public_id, upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)));

  INSERT INTO public.profiles (user_id, public_id, cpf, phone)
  VALUES (
    NEW.id,
    generated_public_id,
    COALESCE(NEW.raw_user_meta_data ->> 'cpf', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );

  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();