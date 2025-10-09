import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getUser().then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password);
    if (!error && data) {
      setUser(data.user);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await auth.signUp(email, password, fullName);
    if (!error && data) {
      setUser(data.user);
    }
    return { error };
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}