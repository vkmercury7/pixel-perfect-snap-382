import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { History, LogOut, Shield, UserRound } from "lucide-react";

import { Shell } from "@/components/nox/Shell";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta | NOX CASINO" },
      { name: "description", content: "Dados da sua conta NOX CASINO: ID público, contato e segurança." },
      { property: "og:title", content: "Minha conta | NOX CASINO" },
      { property: "og:description", content: "Painel da conta no NOX CASINO." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, ready, logout } = useAuth();
  const { open } = useAuthModal();
  const navigate = useNavigate();

  if (!ready) {
    return (
      <Shell>
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <UserRound className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold">Você ainda não tem uma conta</p>
          <button
            type="button"
            onClick={() => open("register")}
            className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-glow"
          >
            Criar conta
          </button>
        </div>
      </Shell>
    );
  }

  const rows = [
    { label: "ID da conta", value: user.publicId },
    { label: "CPF", value: user.cpf },
    { label: "E-mail", value: user.email },
    { label: "Telefone", value: user.phone },
    {
      label: "Conta criada em",
      value: new Date(user.createdAt).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <Shell>
      <h1 className="text-lg font-bold">Minha conta</h1>

      <div className="surface-panel mt-4 flex items-center gap-3 rounded-2xl p-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          <UserRound className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">Jogador NOX</p>
          <p className="truncate text-xs text-muted-foreground">ID: {user.publicId}</p>
        </div>
      </div>

      <dl className="surface-panel mt-3 divide-y divide-border rounded-2xl">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-3">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="truncate text-xs font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>

      <section id="historico" className="surface-panel mt-3 rounded-2xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <History className="h-4 w-4 text-primary" /> Histórico
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Nenhuma atividade registrada nesta demonstração.
        </p>
      </section>

      <section id="seguranca" className="surface-panel mt-3 rounded-2xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Shield className="h-4 w-4 text-primary" /> Segurança
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Senha definida no cadastro. Verificação em duas etapas ficará disponível na próxima etapa.
        </p>
      </section>

      <button
        type="button"
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-xs font-bold uppercase tracking-wide text-destructive"
      >
        <LogOut className="h-4 w-4" /> Sair
      </button>
    </Shell>
  );
}
