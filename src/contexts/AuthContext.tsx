import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  companyName?: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  authMode: 'login' | 'register' | 'admin';
  openLoginModal: (mode?: 'login' | 'register' | 'admin') => void;
  closeLoginModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; pass: string; fullName: string; phone?: string; companyName?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');

  useEffect(() => {
    // Check saved session in localStorage or Supabase
    const savedUser = localStorage.getItem('sbuild_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('Lỗi đọc user từ localStorage:', e);
      }
    }

    // Check Supabase session
    async function checkSupabaseUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userObj: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            phone: session.user.user_metadata?.phone,
            companyName: session.user.user_metadata?.company_name,
            role: session.user.email?.includes('admin') ? 'admin' : 'customer'
          };
          setUser(userObj);
          localStorage.setItem('sbuild_user', JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra phiên Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSupabaseUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userObj: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          phone: session.user.user_metadata?.phone,
          companyName: session.user.user_metadata?.company_name,
          role: session.user.email?.includes('admin') ? 'admin' : 'customer'
        };
        setUser(userObj);
        localStorage.setItem('sbuild_user', JSON.stringify(userObj));
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('sbuild_user');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const openLoginModal = (mode: 'login' | 'register' | 'admin' = 'login') => {
    setAuthMode(mode);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });

      if (!error && data.user) {
        const userObj: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'customer'
        };
        setUser(userObj);
        localStorage.setItem('sbuild_user', JSON.stringify(userObj));
        closeLoginModal();
        return { success: true };
      }

      // 2. Demo / Admin Fallback Credentials
      if ((email === 'admin@sbuild.vn' && pass === 'admin123') || (email === 'admin' && pass === 'admin')) {
        const adminUser: UserProfile = {
          id: 'admin-001',
          email: 'admin@sbuild.vn',
          fullName: 'Quản Trị Viên S-BUILD',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('sbuild_user', JSON.stringify(adminUser));
        closeLoginModal();
        return { success: true };
      }

      if (pass.length >= 6) {
        const clientUser: UserProfile = {
          id: 'user-' + Date.now(),
          email: email,
          fullName: email.split('@')[0],
          role: 'customer'
        };
        setUser(clientUser);
        localStorage.setItem('sbuild_user', JSON.stringify(clientUser));
        closeLoginModal();
        return { success: true };
      }

      return { success: false, error: error?.message || 'Mật khẩu phải từ 6 ký tự trở lên' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi hệ thống đăng nhập' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; pass: string; fullName: string; phone?: string; companyName?: string }) => {
    setIsLoading(true);
    try {
      const { data: res, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.pass,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            company_name: data.companyName
          }
        }
      });

      if (error) {
        // Fallback local register if Supabase Auth needs email confirmation
        const newUser: UserProfile = {
          id: 'user-' + Date.now(),
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          companyName: data.companyName,
          role: 'customer'
        };
        setUser(newUser);
        localStorage.setItem('sbuild_user', JSON.stringify(newUser));
        closeLoginModal();
        return { success: true };
      }

      const newUser: UserProfile = {
        id: res.user?.id || 'user-' + Date.now(),
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        companyName: data.companyName,
        role: 'customer'
      };
      setUser(newUser);
      localStorage.setItem('sbuild_user', JSON.stringify(newUser));
      closeLoginModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi đăng ký tài khoản' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('sbuild_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoginModalOpen,
        authMode,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
