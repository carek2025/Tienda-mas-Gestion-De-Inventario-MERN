// src/contexts/AuthContext.tsx (updated with role)
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'staff';
  address?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: 'customer' | 'staff') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      if (data.user.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'staff') => {
    const { data, error } = await auth.signUp(email, password, fullName, role);
    if (!error && data) {
      setUser(data.user);
      if (data.user.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
    return { error };
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/');
  };

  const updateProfile = async (data: Partial<User>) => {
    const { data: updated, error } = await auth.updateUser(data);
    if (!error && updated) {
      setUser(updated);
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
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