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
import { supabase } from "@/integrations/supabase/client";

/**
 * Camada de carteira do protótipo.
 *
 * O formato dos dados já espelha o que o backend vai persistir depois:
 *   usuário -> saldo -> transações (com external_id da gateway PIX).
 *
 * O saldo NUNCA é alterado pela interface: novas contas começam em 0 e só a
 * confirmação de pagamento (backend, etapa futura) poderá creditar valores.
 */
export type TransactionType = "deposit" | "withdrawal" | "bonus";
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
  createdAt: string;
  updatedAt: string;
}

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  deposit: "Depósito",
  withdrawal: "Retirada",
  bonus: "Bônus",
};

export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Recusado",
  canceled: "Cancelado",
};

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
  requestWithdrawal: (input: { amount: number; pixKeyType: PixKeyType; pixKey: string }) => Promise<WalletTransaction>;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<ModalView>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setReady(true);
      return;
    }
    const [{ data: wallet }, { data: rows }] = await Promise.all([
      supabase.from("wallets").select("balance_cents").single(),
      supabase.from("wallet_transactions").select("*").order("created_at", { ascending: false }),
    ]);
    setBalance(wallet?.balance_cents ?? 0);
    setTransactions((rows ?? []).map((row) => ({
      id: row.id,
      userId: user.publicId,
      type: row.type,
      amount: row.amount_cents,
      status: row.status,
      externalId: row.external_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })));
    setReady(true);
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const requestWithdrawal = useCallback(
    async ({ amount }: { amount: number; pixKeyType: PixKeyType; pixKey: string }) => {
      if (!user) throw new Error("Entre na sua conta para solicitar uma retirada.");
      if (amount <= 0) throw new Error("Informe um valor válido para a retirada.");
      if (amount > balance) throw new Error("Saldo insuficiente para realizar esta retirada.");

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Entre na sua conta para solicitar uma retirada.");
      const { data, error } = await supabase.from("wallet_transactions").insert({
        user_id: authData.user.id,
        type: "withdrawal",
        amount_cents: amount,
        status: "pending",
      }).select().single();
      if (error) throw error;
      const tx: WalletTransaction = {
        id: data.id,
        userId: user.publicId,
        type: data.type,
        amount: data.amount_cents,
        status: data.status,
        externalId: data.external_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setTransactions((prev) => [tx, ...prev]);
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
      refresh,
    }),
    [balance, transactions, ready, modal, requestWithdrawal, refresh],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet precisa estar dentro de WalletProvider");
  return ctx;
}
