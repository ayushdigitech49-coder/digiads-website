import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService, type AdminUser } from '../services/admin.service';

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permissionKey: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sumit_admin_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          const res = await adminService.verifyToken(token);
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    verify();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await adminService.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('sumit_admin_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('sumit_admin_token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return user.permissions.includes(permissionKey);
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, loading, login, logout, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
