'use client'; 

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; 


interface AuthContextType {
  isAuthenticated: boolean; 
  isLoading: boolean;    
  login: (access: string, refresh: string) => void;
  logout: () => void;     
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const router = useRouter(); 


  useEffect(() => {
    console.log("Auth Context: Checking localStorage for token...");
    const token = Cookies.get('access'); 
    if (token) {
      console.log("Auth Context: Token found, setting authenticated.");
      setIsAuthenticated(true);
    } else {
      console.log("Auth Context: No token found.");
    }
    setIsLoading(false); 
  }, []);

  const login = (access: string, refresh: string) => {
    console.log("Auth Context: Logging in...");
    Cookies.set('access', access, { path: '/', expires: 7 });
    Cookies.set('refresh', refresh, { path: '/', expires: 7 });
    
    setIsAuthenticated(true); 
   
  };


  const logout = () => {
    console.log("Auth Context: Logging out...");
    Cookies.remove('access'); 
    Cookies.remove('refresh');
    setIsAuthenticated(false); 
    router.push('/');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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