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
    console.log("Auth Context: Attempting to store token in localStorage...");
    if (token) {
      localStorage.setItem('authToken', token);
      console.log("Auth Context: Token stored successfully.");
    } else {
      console.warn("Auth Context: No token provided to store.");
    }

    console.log("Auth Context: Checking localStorage for token...");
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      console.log("Auth Context: Token found in localStorage.", storedToken);
    } else {
      console.warn("Auth Context: No token found in localStorage.");
    }

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