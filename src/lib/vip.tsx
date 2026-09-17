import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type VipTier = "bronze" | "silver" | "gold" | "diamond";

export const VIP_LEVELS: { id: VipTier; label: string; requirement: number | null }[] = [
  { id: "bronze", label: "Bronze", requirement: 0 },
  { id: "silver", label: "Prata", requirement: null },
  { id: "gold", label: "Ouro", requirement: null },
  { id: "diamond", label: "Diamante", requirement: null },
];

interface VipContextValue {
  tier: VipTier;
  progress: number;
  ready: boolean;
  refresh: () => Promise<void>;
}

const VipContext = createContext<VipContextValue | null>(null);

export function VipProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tier, setTier] = useState<VipTier>("bronze");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setTier("bronze");
      setProgress(0);
      setReady(true);
      return;
    }
    const { data } = await supabase.from("wallets").select("vip_tier, vip_progress_cents").single();
    setTier(data?.vip_tier ?? "bronze");
    setProgress(data?.vip_progress_cents ?? 0);
    setReady(true);
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const value = useMemo(() => ({ tier, progress, ready, refresh }), [tier, progress, ready, refresh]);
  return <VipContext.Provider value={value}>{children}</VipContext.Provider>;
}

export function useVip() {
  const context = useContext(VipContext);
  if (!context) throw new Error("useVip precisa estar dentro de VipProvider");
  return context;
}