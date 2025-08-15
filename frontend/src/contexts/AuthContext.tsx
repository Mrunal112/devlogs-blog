import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const verifyToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      setUser(null);
      return false;
    }

    try {
      const response = await axios.get(`${backendUrl}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(true);
      setIsLoading(false);
      setUser(response.data.user);
      return true;
    } catch {
      // Token is invalid, remove it
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsLoading(false);
      setUser(null);
      return false;
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    verifyToken();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    verifyToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
