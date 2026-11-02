import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillswap_token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Verify auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('skillswap_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data && res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('skillswap_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          // Token expired or invalid
          localStorage.removeItem('skillswap_token');
          localStorage.removeItem('skillswap_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data && res.data.success) {
        const { token: newToken, user: userData, message } = res.data;
        localStorage.setItem('skillswap_token', newToken);
        localStorage.setItem('skillswap_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        showToast(message || 'Welcome back to SkillSwap!', 'success');
        return { success: true, user: userData };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.data && res.data.success) {
        const { token: newToken, user: newUser, message } = res.data;
        localStorage.setItem('skillswap_token', newToken);
        localStorage.setItem('skillswap_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        showToast(message || 'Account created successfully!', 'success');
        return { success: true, user: newUser };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    setToken(null);
    setUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  // Update current user locally & sync
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('skillswap_user', JSON.stringify(merged));
      return merged;
    });
  };

  // Re-fetch profile
  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.data && res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('skillswap_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user info:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        toast,
        showToast,
        closeToast,
      }}
    >
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
