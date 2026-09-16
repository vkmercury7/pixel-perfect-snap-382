import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import heroBanner from "@/assets/hero-banner.jpg";
import { Logo } from "./Logo";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";

function maskCPF(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const fieldClass =
  "w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring";

export function RegisterModal() {
  const { mode, open, close } = useAuthModal();
  const { user, register, login } = useAuth();

  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [identifier, setIdentifier] = useState("");

  // Abre o cadastro automaticamente ~3s após a primeira visita.
  useEffect(() => {
    if (user) return () => {};
    const timer = setTimeout(() => open("register"), 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const isRegister = mode === "register";

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    if (cpf.replace(/\D/g, "").length !== 11) {
      toast.error("Informe um CPF com 11 dígitos.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Informe um telefone válido.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (!accepted) {
      toast.error("É necessário aceitar os termos para continuar.");
      return;
    }


    const created = register({ cpf, email, phone: `+55 ${phone}`, password });
    close();
    toast.success(`Conta criada! Seu ID é ${created.publicId}`);
  }

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      const logged = login(identifier, password);
      close();
      toast.success(`Bem-vindo de volta, ${logged.publicId}`);
    } catch {
      toast.error("Não encontramos essa conta. Confira os dados ou crie uma conta.");
    }
  }

  return (
    <Dialog open={mode !== null} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto border-border bg-card p-0 sm:max-w-[26rem]">

        <div className="relative">
          <img
            src={heroBanner}
            alt=""
            loading="lazy"
            width={1600}
            height={912}
            className="h-28 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
            <Logo size="lg" />
          </div>
        </div>

        <div className="p-5 pt-3">
          <DialogTitle className="text-center text-lg font-bold">
            {isRegister ? "Criar sua conta" : "Entrar na sua conta"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-center text-xs text-muted-foreground">
            {isRegister
              ? "Leva menos de um minuto. Ambiente de demonstração, sem dinheiro real."
              : "Use o e-mail, CPF ou ID da sua conta."}
          </DialogDescription>

          {isRegister ? (
            <form onSubmit={handleRegister} className="mt-4 space-y-3">
              <input
                className={fieldClass}
                placeholder="CPF"
                inputMode="numeric"
                value={cpf}
                onChange={(e) => setCpf(maskCPF(e.target.value))}
                required
              />
              <input
                className={fieldClass}
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex items-stretch gap-2">
                <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-input bg-surface px-3 text-sm text-muted-foreground">
                  +55
                </span>
                <input
                  className={fieldClass}
                  placeholder="(11) 91234-5678"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  required
                />
              </div>
              <div className="relative">
                <input
                  className={fieldClass}
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[0.7rem] leading-snug text-muted-foreground">
                <Checkbox
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(v === true)}
                  className="mt-0.5"
                />
                Confirmo que sou maior de 18 anos e aceito os Termos e Condições e a Política de
                Privacidade.
              </label>

              <button
                type="submit"
                className="mt-1 w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                Criar conta
              </button>

              <p className="pt-1 text-center text-[0.7rem] text-muted-foreground">
                Já tem conta?{" "}
                <button type="button" onClick={() => open("login")} className="font-semibold text-primary">
                  Entrar
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mt-4 space-y-3">
              <input
                className={fieldClass}
                placeholder="E-mail, CPF ou ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <input
                className={fieldClass}
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-1 w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                Entrar
              </button>
              <p className="pt-1 text-center text-[0.7rem] text-muted-foreground">
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => open("register")}
                  className="font-semibold text-primary"
                >
                  Cadastrar
                </button>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
