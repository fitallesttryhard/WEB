import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'client';
  fullName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUserState] = useState<User | null>(() => {
    return {
      id: 'usr-fitallest-admin',
      email: 'admin@fitallest.com',
      role: 'admin',
      fullName: 'Quản Trị Viên Fi.tallest',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  const setUser = (userObj: User | null) => {
    setUserState(userObj);
    if (userObj) {
      localStorage.setItem('fitallest_user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('fitallest_user');
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if ((email === 'admin@fitallest.com' && pass === 'admin123') || (email === 'admin' && pass === 'admin')) {
        const adminUser: User = {
          id: 'usr-fitallest-admin',
          email: 'admin@fitallest.com',
          role: 'admin',
          fullName: 'Quản Trị Viên Fi.tallest',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        };
        setUser(adminUser);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Email hoặc Mật khẩu không đúng' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Lỗi hệ thống' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
