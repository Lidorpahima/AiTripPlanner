'use client'; 

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
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
    const token = localStorage.getItem('access'); 
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
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    setIsAuthenticated(true); 
   
  };


  const logout = () => {
    console.log("Auth Context: Logging out...");
    localStorage.removeItem('access'); 
    localStorage.removeItem('refresh');
    setIsAuthenticated(false); 
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