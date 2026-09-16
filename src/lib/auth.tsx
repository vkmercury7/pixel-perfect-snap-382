import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Protótipo: a conta é criada localmente no navegador.
 * A interface abaixo é o único ponto de contato com "auth", então trocar
 * este arquivo por um backend real depois não afeta os componentes.
 */
export interface NoxUser {
  publicId: string;
  cpf: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface StoredUser extends NoxUser {
  password: string;
}

export interface RegisterInput {
  cpf: string;
  email: string;
  phone: string;
  password: string;
}

const USERS_KEY = "nox.users";
const SESSION_KEY = "nox.session";
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
  register: (input: RegisterInput) => NoxUser;
  login: (identifier: string, password: string) => NoxUser;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (gameId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NoxUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readJSON<NoxUser | null>(SESSION_KEY, null);
    setUser(session);
    setFavorites(readJSON<string[]>(FAVORITES_KEY, []));
    setReady(true);
  }, []);

  const register = useCallback((input: RegisterInput) => {
    const users = readJSON<StoredUser[]>(USERS_KEY, []);
    const existingIds = new Set(users.map((u) => u.publicId));
    let publicId = generatePublicId();
    while (existingIds.has(publicId)) publicId = generatePublicId();

    const stored: StoredUser = {
      publicId,
      cpf: input.cpf,
      email: input.email,
      phone: input.phone,
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, stored]));

    const { password: _password, ...publicUser } = stored;
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    return publicUser;
  }, []);

  const login = useCallback((identifier: string, password: string) => {
    const users = readJSON<StoredUser[]>(USERS_KEY, []);
    const key = identifier.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === key ||
        u.publicId.toLowerCase() === key ||
        u.cpf.replace(/\D/g, "") === identifier.replace(/\D/g, ""),
    );
    if (!found || found.password !== password) {
      throw new Error("Dados de acesso inválidos.");
    }
    const { password: _password, ...publicUser } = found;
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    return publicUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
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
