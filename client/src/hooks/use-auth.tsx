
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Admin {
  id: number;
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  adminToken: string | null;
  login: (user: User) => void;
  logout: () => void;
  adminLogin: (admin: Admin, token: string) => void;
  adminLogout: () => void;
  checkAdminLogin: (username: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check for existing admin session
    const savedAdmin = localStorage.getItem('admin');
    const savedToken = localStorage.getItem('adminToken');
    if (savedAdmin && savedToken) {
      setAdmin(JSON.parse(savedAdmin));
      setAdminToken(savedToken);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const checkAdminLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        adminLogin(data.admin, data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const adminLogin = (adminData: Admin, token: string) => {
    setAdmin(adminData);
    setAdminToken(token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', token);
  };

  const adminLogout = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  const value = {
    user,
    admin,
    adminToken,
    login,
    logout,
    adminLogin,
    adminLogout,
    checkAdminLogin,
    isAuthenticated: !!user,
    isAdmin: !!admin && !!adminToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
