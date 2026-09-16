import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthModalMode = "register" | "login";

interface AuthModalContextValue {
  mode: AuthModalMode | null;
  open: (mode: AuthModalMode) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthModalMode | null>(null);
  const value = useMemo(
    () => ({ mode, open: (m: AuthModalMode) => setMode(m), close: () => setMode(null) }),
    [mode],
  );
  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal precisa estar dentro de AuthModalProvider");
  return ctx;
}
