// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Demo users (simulated database)
const DEMO_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@travel.com',
    password: 'travel123',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=006A4E&color=fff&size=128',
    role: 'admin',
    joinDate: '2024-01-15',
    bio: 'Passionate traveler exploring the beauty of Bangladesh.',
  },
  {
    id: 2,
    name: 'Rafi Ahmed',
    email: 'rafi@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Rafi+Ahmed&background=F42A41&color=fff&size=128',
    role: 'user',
    joinDate: '2024-03-22',
    bio: 'Adventure seeker & hill-station lover.',
  },
];

const AUTH_KEY = 'bd_tourism_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    // Don't store password in state/storage
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    return { success: true };
  }, []);

  const register = useCallback((name, email, password) => {
    const exists = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=006A4E&color=fff&size=128`,
      role: 'user',
      joinDate: new Date().toISOString().split('T')[0],
      bio: 'Exploring the beauty of Bangladesh!',
    };
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      return updated;
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
