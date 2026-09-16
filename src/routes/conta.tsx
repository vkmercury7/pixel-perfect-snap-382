import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  LogOut,
  Shield,
  UserRound,
  Wallet,
} from "lucide-react";

import { PixKeySection } from "@/components/nox/PixKeySection";
import { Shell } from "@/components/nox/Shell";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";
import { formatBRL } from "@/lib/money";
import {
  TRANSACTION_STATUS_LABEL,
  TRANSACTION_TYPE_LABEL,
  useWallet,
  type TransactionStatus,
} from "@/lib/wallet";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta e carteira | NOX CASINO" },
      {
        name: "description",
        content: "Saldo, depósitos, retiradas e histórico de transações da sua conta NOX CASINO.",
      },
      { property: "og:title", content: "Minha conta e carteira | NOX CASINO" },
      { property: "og:description", content: "Carteira, depósito, retirada e histórico no NOX CASINO." },
    ],
  }),
  component: AccountPage,
});

const STATUS_STYLE: Record<TransactionStatus, string> = {
  pending: "bg-primary/15 text-primary",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-destructive/15 text-destructive",
  canceled: "bg-muted text-muted-foreground",
};

function AccountPage() {
  const { user, ready, logout } = useAuth();
  const { open } = useAuthModal();
  const { balance, transactions, openDeposit, openWithdraw } = useWallet();
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

  const menu = [
    { label: "Carteira", icon: Wallet, href: "#carteira" },
    { label: "Depositar", icon: ArrowDownToLine, action: openDeposit },
    { label: "Retirar", icon: ArrowUpFromLine, action: openWithdraw },
    { label: "Histórico", icon: History, href: "#historico" },
    { label: "Dados pessoais", icon: UserRound, href: "#dados" },
    { label: "Segurança", icon: Shield, href: "#seguranca" },
  ] as const;

  return (
    <Shell>
      <h1 className="text-lg font-bold">Minha conta</h1>

      <section id="carteira" className="surface-panel mt-4 rounded-2xl p-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
          Saldo disponível
        </p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums">{formatBRL(balance)}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={openDeposit}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-extrabold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
          >
            <ArrowDownToLine className="h-4 w-4" /> Depositar
          </button>
          <button
            type="button"
            onClick={openWithdraw}
            className="flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-surface py-3.5 text-xs font-extrabold uppercase tracking-wide text-primary transition-colors hover:bg-accent"
          >
            <ArrowUpFromLine className="h-4 w-4" /> Retirar
          </button>
        </div>
      </section>

      <PixKeySection />

      <nav className="surface-panel mt-3 divide-y divide-border rounded-2xl">
        {menu.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">{item.label}</span>
            </>
          );
          return "href" in item ? (
            <a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3.5">
              {content}
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              {content}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs font-semibold">Sair</span>
        </button>
      </nav>

      <section id="historico" className="surface-panel mt-3 rounded-2xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <History className="h-4 w-4 text-primary" /> Histórico de transações
        </h2>
        {transactions.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Nenhuma transação encontrada.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold">{TRANSACTION_TYPE_LABEL[tx.type]}</p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold tabular-nums">{formatBRL(tx.amount)}</p>
                  <span
                    className={`mt-0.5 inline-block rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${STATUS_STYLE[tx.status]}`}
                  >
                    {TRANSACTION_STATUS_LABEL[tx.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="dados" className="mt-3">
        <h2 className="px-1 text-sm font-bold">Dados pessoais</h2>
        <dl className="surface-panel mt-2 divide-y divide-border rounded-2xl">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="truncate text-xs font-semibold">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="seguranca" className="surface-panel mt-3 rounded-2xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Shield className="h-4 w-4 text-primary" /> Segurança
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Senha definida no cadastro. Verificação em duas etapas ficará disponível na próxima etapa.
        </p>
      </section>
    </Shell>
  );
}
