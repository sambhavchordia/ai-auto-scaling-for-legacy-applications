import { useState, useEffect, createContext, useContext } from 'react';

type AuthUser = { id: string; email: string } | null;
type Session = { token: string } | null;

interface AuthContextType {
  user: AuthUser;
  session: Session;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.user) {
          setSession({ token: parsed.token });
          setUser(parsed.user);
        }
      } catch {}
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { error: new Error(data?.error || 'Signup failed') };
      localStorage.setItem('auth', JSON.stringify(data));
      setSession({ token: data.token });
      setUser(data.user);
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { error: new Error(data?.error || 'Signin failed') };
      localStorage.setItem('auth', JSON.stringify(data));
      setSession({ token: data.token });
      setUser(data.user);
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};