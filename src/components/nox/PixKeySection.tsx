import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";

/**
 * Protótipo: a chave PIX de retirada fica salva por usuário (publicId),
 * então continua cadastrada depois de sair e entrar novamente.
 * Trocar apenas este armazenamento por um backend real depois.
 */
const PIX_KEYS_STORAGE = "nox.pixKeys";

type PixKeyType = "cpf" | "phone" | "email" | "random";

const TYPES: { id: PixKeyType; label: string; placeholder: string }[] = [
  { id: "cpf", label: "CPF", placeholder: "000.000.000-00" },
  { id: "phone", label: "Celular", placeholder: "(00) 00000-0000" },
  { id: "email", label: "E-mail", placeholder: "seu@email.com" },
  { id: "random", label: "Chave aleatória", placeholder: "chave aleatória" },
];

interface StoredPixKey {
  type: PixKeyType;
  value: string;
}

function readAll(): Record<string, StoredPixKey> {
  try {
    const raw = localStorage.getItem(PIX_KEYS_STORAGE);
    return raw ? (JSON.parse(raw) as Record<string, StoredPixKey>) : {};
  } catch {
    return {};
  }
}

function maskKey(value: string) {
  const clean = value.trim();
  if (clean.includes("@")) {
    const [name = "", domain = ""] = clean.split("@");
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
  }
  if (clean.length <= 6) return `${clean.slice(0, 2)}${"*".repeat(4)}`;
  return `${clean.slice(0, 3)}${"*".repeat(Math.min(clean.length - 6, 8))}${clean.slice(-3)}`;
}

export function PixKeySection() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<StoredPixKey | null>(null);
  const [editing, setEditing] = useState(false);
  const [type, setType] = useState<PixKeyType>("cpf");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!user) return;
    const current = readAll()[user.publicId] ?? null;
    setSaved(current);
    setEditing(!current);
    if (current) {
      setType(current.type);
      setValue(current.value);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    const clean = value.trim();
    if (!clean) {
      toast.error("Digite sua chave PIX para continuar.");
      return;
    }
    const all = readAll();
    const entry: StoredPixKey = { type, value: clean };
    all[user.publicId] = entry;
    localStorage.setItem(PIX_KEYS_STORAGE, JSON.stringify(all));
    setSaved(entry);
    setEditing(false);
    toast.success("Chave PIX cadastrada com sucesso.");
  };

  const typeLabel = TYPES.find((t) => t.id === (saved?.type ?? type))?.label ?? "";
  const placeholder = TYPES.find((t) => t.id === type)?.placeholder ?? "Digite sua chave PIX";

  return (
    <section className="surface-panel mt-3 rounded-2xl p-4">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <KeyRound className="h-4 w-4 text-primary" /> Chave PIX para retiradas
      </h2>

      {saved && !editing ? (
        <div className="mt-2">
          <p className="text-xs font-semibold text-primary">Chave PIX cadastrada</p>
          <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
            {typeLabel}
          </p>
          <p className="mt-0.5 truncate text-sm font-bold">{maskKey(saved.value)}</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-3 rounded-xl border border-primary/50 bg-surface px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-primary transition-colors hover:bg-accent"
          >
            Alterar
          </button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-xs text-muted-foreground">
            Cadastre a chave PIX que será utilizada nas suas retiradas.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id)}
                className={`rounded-xl border px-3 py-2 text-[0.7rem] font-bold uppercase tracking-wide transition-colors ${
                  type === item.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            aria-label="Digite sua chave PIX"
            className="mt-3 w-full rounded-xl border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={handleSave}
            className="mt-3 w-full rounded-xl bg-primary py-3.5 text-xs font-extrabold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
          >
            Salvar chave PIX
          </button>
        </>
      )}
    </section>
  );
}
