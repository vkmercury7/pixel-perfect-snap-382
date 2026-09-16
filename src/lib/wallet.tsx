import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/lib/auth";

/**
 * Camada de carteira do protótipo.
 *
 * O formato dos dados já espelha o que o backend vai persistir depois:
 *   usuário -> saldo -> transações (com external_id da gateway PIX).
 *
 * O saldo NUNCA é alterado pela interface: novas contas começam em 0 e só a
 * confirmação de pagamento (backend, etapa futura) poderá creditar valores.
 */
export type TransactionType = "deposit" | "withdrawal";
export type TransactionStatus = "pending" | "approved" | "rejected" | "canceled";
export type PixKeyType = "cpf" | "email" | "phone" | "random";

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  /** Sempre em centavos. */
  amount: number;
  status: TransactionStatus;
  externalId: string | null;
  pixKeyType?: PixKeyType;
  pixKey?: string;
  createdAt: string;
  updatedAt: string;
}

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  deposit: "Depósito",
  withdrawal: "Retirada",
};

export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Recusado",
  canceled: "Cancelado",
};

const BALANCES_KEY = "nox.balances";
const TRANSACTIONS_KEY = "nox.transactions";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type ModalView = null | "deposit" | "withdraw";

interface WalletContextValue {
  /** Saldo do usuário logado, em centavos. */
  balance: number;
  transactions: WalletTransaction[];
  ready: boolean;
  modal: ModalView;
  openDeposit: () => void;
  openWithdraw: () => void;
  closeModal: () => void;
  requestWithdrawal: (input: { amount: number; pixKeyType: PixKeyType; pixKey: string }) => WalletTransaction;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [allTransactions, setAllTransactions] = useState<WalletTransaction[]>([]);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<ModalView>(null);

  useEffect(() => {
    setBalances(readJSON<Record<string, number>>(BALANCES_KEY, {}));
    setAllTransactions(readJSON<WalletTransaction[]>(TRANSACTIONS_KEY, []));
    setReady(true);
  }, []);

  // Toda conta nova entra na carteira com saldo zero.
  useEffect(() => {
    if (!ready || !user) return;
    setBalances((prev) => {
      if (prev[user.publicId] !== undefined) return prev;
      const next = { ...prev, [user.publicId]: 0 };
      localStorage.setItem(BALANCES_KEY, JSON.stringify(next));
      return next;
    });
  }, [ready, user]);

  const balance = user ? (balances[user.publicId] ?? 0) : 0;

  const transactions = useMemo(
    () =>
      user
        ? allTransactions
            .filter((t) => t.userId === user.publicId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [allTransactions, user],
  );

  const requestWithdrawal = useCallback(
    ({ amount, pixKeyType, pixKey }: { amount: number; pixKeyType: PixKeyType; pixKey: string }) => {
      if (!user) throw new Error("Entre na sua conta para solicitar uma retirada.");
      if (amount <= 0) throw new Error("Informe um valor válido para a retirada.");
      if (amount > balance) throw new Error("Saldo insuficiente para realizar esta retirada.");

      const now = new Date().toISOString();
      const tx: WalletTransaction = {
        id: crypto.randomUUID(),
        userId: user.publicId,
        type: "withdrawal",
        amount,
        status: "pending",
        externalId: null,
        pixKeyType,
        pixKey,
        createdAt: now,
        updatedAt: now,
      };
      setAllTransactions((prev) => {
        const next = [tx, ...prev];
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
        return next;
      });
      return tx;
    },
    [balance, user],
  );

  const value = useMemo(
    () => ({
      balance,
      transactions,
      ready,
      modal,
      openDeposit: () => setModal("deposit"),
      openWithdraw: () => setModal("withdraw"),
      closeModal: () => setModal(null),
      requestWithdrawal,
    }),
    [balance, transactions, ready, modal, requestWithdrawal],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet precisa estar dentro de WalletProvider");
  return ctx;
}
