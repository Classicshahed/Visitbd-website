// src/context/AuthContext.jsx
// Real Database-Backed Authentication Context (SQLite / REST API)
import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser, updateUserProfile } from '../services/api';

const AuthContext = createContext(null);

const AUTH_KEY = 'bd_tourism_user';
const TOKEN_KEY = 'bd_tourism_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    try {
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(AUTH_KEY, JSON.stringify(res.user));
        if (res.token) localStorage.setItem(TOKEN_KEY, res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Invalid email or password.' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid email or password.' };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await registerUser(name, email, password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(AUTH_KEY, JSON.stringify(res.user));
        if (res.token) localStorage.setItem(TOKEN_KEY, res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(AUTH_KEY, JSON.stringify(next));
      if (next.id) {
        updateUserProfile(next).catch(() => {});
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
