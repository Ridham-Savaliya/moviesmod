import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '@/lib/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (token && savedUser) {
      try {
        const response = await authAPI.getMe();
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setUser(user);
        toast.success('Login successful!');
        router.push('/dashboard');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    router.push('/login');
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
