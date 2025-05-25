'use client'; 

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; 


interface AuthContextType {
  isAuthenticated: boolean; 
  isLoading: boolean;    
  login: (access: string, refresh: string) => void;
  logout: () => void;     
  refreshAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const router = useRouter(); 

  const refreshAuthState = () => {
    const accessToken = Cookies.get('access');
    setIsAuthenticated(!!accessToken);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAuthState();
  }, []);

  const login = (access: string, refresh: string) => {
    Cookies.set('access', access, { 
      path: '/', 
      expires: 7,
      secure: window.location.protocol === "https:",
      sameSite: 'strict'
    });
    Cookies.set('refresh', refresh, { 
      path: '/', 
      expires: 30,
      secure: window.location.protocol === "https:",
      sameSite: 'strict'
    });
    
    setIsAuthenticated(true); 
    setIsLoading(false);
  };


  const logout = () => {
    // Clear all authentication tokens from cookies
    Cookies.remove('access'); 
    Cookies.remove('refresh');
    
    setIsAuthenticated(false); 
    setIsLoading(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, refreshAuthState }}>
       {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};