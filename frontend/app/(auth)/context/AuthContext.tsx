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
    console.log("Auth Context: Checking for auth tokens...");
    // Only check cookies for tokens
    const accessToken = Cookies.get('access');
    
    if (accessToken) {
      console.log("Auth Context: Access token found, setting authenticated");
      setIsAuthenticated(true);
    } else {
      console.log("Auth Context: No access token found, user not authenticated");
      setIsAuthenticated(false);
    }
    setIsLoading(false); 
  }, []);

  const login = (access: string, refresh: string) => {
    console.log("Auth Context: Logging in with new tokens...");
    // Store in cookies with proper settings
    Cookies.set('access', access, { 
      path: '/', 
      expires: 7,
      sameSite: 'lax'
    });
    Cookies.set('refresh', refresh, { 
      path: '/', 
      expires: 30,
      sameSite: 'lax'
    });
    
    setIsAuthenticated(true); 
  };


  const logout = () => {
    console.log("Auth Context: Logging out...");
    // Clear all authentication tokens from cookies
    Cookies.remove('access'); 
    Cookies.remove('refresh');
    
    setIsAuthenticated(false); 
    router.push('/');
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