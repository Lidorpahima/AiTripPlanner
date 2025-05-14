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
    // Try to get tokens from multiple sources
    const accessToken = Cookies.get('access') || localStorage.getItem('authToken');
    const refreshToken = Cookies.get('refresh') || localStorage.getItem('refreshToken');
    
    // Ensure cookies have the tokens (in case they were only in localStorage)
    if (accessToken) {
      Cookies.set('access', accessToken, { 
        path: '/', 
        expires: 7,
        // Using less restrictive settings for cookie
        sameSite: 'lax'
      });
      localStorage.setItem('authToken', accessToken);
      console.log("Auth Context: Access token found and stored in both cookie and localStorage");
    } else {
      console.warn("Auth Context: No access token found in any storage");
    }
    
    if (refreshToken) {
      Cookies.set('refresh', refreshToken, { 
        path: '/', 
        expires: 30,
        // Using less restrictive settings for cookie
        sameSite: 'lax'
      });
      localStorage.setItem('refreshToken', refreshToken);
      console.log("Auth Context: Refresh token found and stored in both cookie and localStorage");
    } else {
      console.warn("Auth Context: No refresh token found in any storage");
    }

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
      // Using less restrictive settings for cookie
      sameSite: 'lax'
    });
    Cookies.set('refresh', refresh, { 
      path: '/', 
      expires: 30,
      // Using less restrictive settings for cookie
      sameSite: 'lax'
    });
    
    // Backup in localStorage
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    setIsAuthenticated(true); 
  };


  const logout = () => {
    console.log("Auth Context: Logging out...");
    // Clear all authentication tokens from all storage locations
    Cookies.remove('access'); 
    Cookies.remove('refresh');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
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