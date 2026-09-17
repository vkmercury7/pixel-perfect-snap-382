import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NoxUser {
  publicId: string;
  cpf: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface RegisterInput {
  cpf: string;
  email: string;
  phone: string;
  password: string;
}

const FAVORITES_KEY = "nox.favorites";

const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generatePublicId(): string {
  const length = 10 + Math.floor(Math.random() * 7); // 10-16 chars
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface AuthContextValue {
  user: NoxUser | null;
  ready: boolean;
  register: (input: RegisterInput) => Promise<NoxUser | null>;
  login: (identifier: string, password: string) => Promise<NoxUser>;
  logout: () => Promise<void>;
  favorites: string[];
  toggleFavorite: (gameId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NoxUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async (authUser: { id: string; email?: string | null }) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("public_id, cpf, phone, created_at")
      .eq("user_id", authUser.id)
      .single();
    if (error) throw error;
    const next: NoxUser = {
      publicId: data.public_id,
      cpf: data.cpf,
      email: authUser.email ?? "",
      phone: data.phone,
      createdAt: data.created_at,
    };
    setUser(next);
    return next;
  }, []);

  useEffect(() => {
    setFavorites(readJSON<string[]>(FAVORITES_KEY, []));
    void supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) await loadProfile(data.user).catch(() => setUser(null));
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") setUser(null);
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        queueMicrotask(() => void loadProfile(session.user).catch(() => setUser(null)));
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const register = useCallback(async (input: RegisterInput) => {
    const publicId = generatePublicId();
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { public_id: publicId, cpf: input.cpf, phone: input.phone },
      },
    });
    if (error) throw error;
    if (!data.session || !data.user) return null;
    return loadProfile(data.user);
  }, [loadProfile]);

  const login = useCallback(async (identifier: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) throw error ?? new Error("Dados de acesso inválidos.");
    return loadProfile(data.user);
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const toggleFavorite = useCallback((gameId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, ready, register, login, logout, favorites, toggleFavorite }),
    [user, ready, register, login, logout, favorites, toggleFavorite],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
