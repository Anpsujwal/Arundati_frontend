import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.data.user);
      setProfile(res.data.data.profile);
    } catch {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCurrentUser(); }, [loadCurrentUser]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { user: u, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { user: u, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(u);
    return u;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const refreshUser = loadCurrentUser;

  const isAdmin = user?.role === 'admin';
  const isApproved = user?.account_status === 'Approved';
  const isPending = user?.account_status === 'Pending_ID';

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshUser, isAdmin, isApproved, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
