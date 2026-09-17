ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_cpf_format_check
  CHECK (cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$'),
  ADD CONSTRAINT profiles_phone_format_check
  CHECK (phone ~ '^\+55 \(\d{2}\) \d{4,5}-\d{4}$'),
  ADD CONSTRAINT profiles_public_id_format_check
  CHECK (public_id ~ '^[A-Za-z0-9]{10,16}$');

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_public_id text := NULLIF(trim(NEW.raw_user_meta_data ->> 'public_id'), '');
  profile_cpf text := NULLIF(trim(NEW.raw_user_meta_data ->> 'cpf'), '');
  profile_phone text := NULLIF(trim(NEW.raw_user_meta_data ->> 'phone'), '');
BEGIN
  IF profile_cpf IS NULL OR profile_cpf !~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$' THEN
    RAISE EXCEPTION 'CPF inválido';
  END IF;

  IF profile_phone IS NULL OR profile_phone !~ '^\+55 \(\d{2}\) \d{4,5}-\d{4}$' THEN
    RAISE EXCEPTION 'Telefone inválido';
  END IF;

  IF profile_public_id IS NULL OR profile_public_id !~ '^[A-Za-z0-9]{10,16}$' THEN
    profile_public_id := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  END IF;

  INSERT INTO public.profiles (user_id, public_id, cpf, phone)
  VALUES (NEW.id, profile_public_id, profile_cpf, profile_phone);

  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;