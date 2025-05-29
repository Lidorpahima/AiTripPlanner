/**
 * AuthContext Component
 * 
 * Provides authentication state management and functionality throughout the application.
 * Features include:
 * - Authentication state tracking
 * - Login/logout functionality
 * - Token management with secure cookies
 * - Loading state handling
 * - Automatic authentication state refresh
 * - Protected route handling
 */

'use client'; 

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; 

/**
 * Interface defining the shape of the authentication context
 * @property isAuthenticated - Boolean indicating if user is currently authenticated
 * @property isLoading - Boolean indicating if authentication state is being checked
 * @property login - Function to handle user login and token storage
 * @property logout - Function to handle user logout and token removal
 * @property refreshAuthState - Function to refresh the current authentication state
 */
interface AuthContextType {
  isAuthenticated: boolean; 
  isLoading: boolean;    
  login: (access: string, refresh: string) => void;
  logout: () => void;     
  refreshAuthState: () => void;
}

// Create the authentication context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props interface for AuthProvider component
 * @property children - React nodes to be wrapped by the auth provider
 */
interface AuthProviderProps {
  children: ReactNode; 
}

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the application.
 * Manages authentication state, token storage, and user session.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for tracking authentication status and loading state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const router = useRouter(); 

  /**
   * Refreshes the authentication state by checking for access token
   * Updates isAuthenticated and isLoading states accordingly
   */
  const refreshAuthState = () => {
    const accessToken = Cookies.get('access');
    setIsAuthenticated(!!accessToken);
    setIsLoading(false);
  };

  // Check authentication state on component mount
  useEffect(() => {
    refreshAuthState();
  }, []);

  /**
   * Handles user login by storing tokens in secure cookies
   * @param access - Access token for API authentication
   * @param refresh - Refresh token for obtaining new access tokens
   */
  const login = (access: string, refresh: string) => {
    // Store access token with 7-day expiration
    Cookies.set('access', access, { 
      path: '/', 
      expires: 7,
      secure: window.location.protocol === "https:",
      sameSite: 'strict'
    });
    // Store refresh token with 30-day expiration
    Cookies.set('refresh', refresh, { 
      path: '/', 
      expires: 30,
      secure: window.location.protocol === "https:",
      sameSite: 'strict'
    });
    
    setIsAuthenticated(true); 
    setIsLoading(false);
  };

  /**
   * Handles user logout by clearing tokens and redirecting to home
   */
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

/**
 * Custom hook for accessing authentication context
 * @returns AuthContextType - The authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};