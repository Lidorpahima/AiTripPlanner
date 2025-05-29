/**
 * GoogleAuthButton Component
 * 
 * A component that handles Google authentication integration, including:
 * - Google Sign-In button rendering
 * - Google API initialization
 * - Token handling
 * - Error management
 * - Loading states
 * - Success notifications
 * - Automatic redirection
 * - Secure cookie management
 */

import React, { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Props interface for GoogleAuthButton component
 * @property context - The context in which the button is used ('signin' or 'signup')
 */
interface GoogleAuthButtonProps {
  context: 'signin' | 'signup';
}

/**
 * GoogleAuthButton Component
 * 
 * Renders a Google Sign-In button and handles the authentication flow.
 * Integrates with Google's Identity Services API and manages the authentication state.
 */
const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ context }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false); 
  const router = useRouter();
  const { login } = useAuth();

  /**
   * Extracts error messages from API response data
   * @param data - The response data from the API
   * @returns Formatted error message string
   */
  const extractErrorMessages = (data: any): string => {
    if (!data) return 'An unexpected error occurred. Please try again.';
    if (typeof data === 'string') return data; 
    let messages: string[] = [];
    if (typeof data === 'object' && data !== null) {
      if (data.detail) {
        messages.push(data.detail);
      } else {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            messages = messages.concat(data[key].map((msg: string) => `${key}: ${msg}`));
          } else if (typeof data[key] === 'string') {
            messages.push(`${key}: ${data[key]}`);
          }
        }
      }
    }
    if (messages.length === 0) {
      return 'An error occurred. Please check your details and try again.';
    }
    return messages.join('\n');
  };

  /**
   * Handles Google authentication response
   * Processes the credential token and manages the authentication flow
   */
  const handleGoogleAuth = useCallback(async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const token = credentialResponse.credential;

      if (!token) {
        setAuthError('Failed to receive authentication token from Google');
        toast.error('Failed to get authentication token from Google');
        setIsLoading(false);
        return;
      }

      // Make API request to backend
      const res = await fetch(`${API_BASE}/api/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      // Handle successful response
      if (res.ok) {
        if (data && data.access && data.refresh) {
          // Store tokens in secure cookies
          Cookies.set('access', data.access, { 
            path: '/', 
            expires: 7,
            secure: window.location.protocol === "https:",
            sameSite: 'strict'
          });
          Cookies.set('refresh', data.refresh, { 
            path: '/', 
            expires: 30,
            secure: window.location.protocol === "https:",
            sameSite: 'strict'
          });
          
          login(data.access, data.refresh);
          toast.success('Google sign-in successful! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setAuthError('Authentication successful but failed to receive tokens');
          toast.error('Authentication succeeded but failed to get tokens');
        }
      } else {
        // Handle error response
        const errorMessage = data.error || extractErrorMessages(data);
        setAuthError(errorMessage);
        toast.error(errorMessage || 'Google authentication failed');
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setAuthError('Failed to authenticate with Google. Please try again.');
      toast.error('Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  }, [login, router, API_BASE]);

  /**
   * Initializes Google Sign-In functionality
   * Sets up the Google Identity Services API
   */
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.trim() === "") {
      toast.error("Google Sign-In is not configured correctly.");
      setIsGoogleApiReady(false);
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleAuth,
            cancel_on_tap_outside: true,
            context: context,
            auto_select: false,
            ux_mode: 'popup',
            locale: 'en',
          });
          setIsGoogleApiReady(true);
          console.log("Google Sign-In initialized successfully.");
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
          toast.error("Failed to initialize Google Sign-In.");
          setIsGoogleApiReady(false);
        }
      } else {
        console.warn("Google GSI library not fully loaded when trying to initialize.");
      }
    };

    // Handle Google script load event
    const handleGoogleScriptLoad = () => {
      console.log("Google script loaded event fired.");
      initializeGoogleSignIn();
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('google-loaded', handleGoogleScriptLoad, { once: true });
    }

    return () => {
      window.removeEventListener('google-loaded', handleGoogleScriptLoad);
    };
  }, [context, handleGoogleAuth]);

  /**
   * Handles custom Google button click
   * Initiates OAuth flow with Google
   */
  const handleCustomGoogleButtonClick = () => {
    const clientId = GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`);
    const scope = encodeURIComponent('openid email profile');
    const oauthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = oauthUrl; 
  };

  return (
    <>
      {/* Load Google Sign-In script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
        onLoad={() => {
          window.dispatchEvent(new Event('google-loaded'));
        }}
        onError={(e) => {
          toast.error("Failed to load Google Sign-In script.");
          setIsGoogleApiReady(false);
        }}
      />
      <div className="flex flex-col items-center w-full mt-3 bg-white rounded-md border border-gray-300 shadow-sm">
        {/* Loading indicator */}
        {isLoading && ( 
          <div className="flex items-center justify-center mb-2">
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-600">Processing Google sign-in...</span>
          </div>
        )}

        {/* Google Sign-In button */}
        <button
          type="button"
          disabled={isLoading || !isGoogleApiReady} 
          onClick={handleCustomGoogleButtonClick}
          className="w-full flex items-center justify-center gap-x-3 bg-white text-gray-800 px-4 py-2.5 rounded-md border-none hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-150 font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed shadow-none cursor-pointer"
        >
          <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            <path fill="none" d="M1 1h22v22H1z"/>
          </svg>
          {context === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
        </button>
        
        {/* Error message display */}
        {authError && (
          <p className="mt-2 text-xs text-red-600">{authError}</p>
        )}
      </div>
    </>
  );
};

export default GoogleAuthButton;

/**
 * Global type declarations for Google Sign-In API
 */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: (momentListener?: (notification: any) => void) => void; 
        }
      }
    }
  }
}