import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { Languages } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ;

interface GoogleAuthButtonProps {
  context: 'signin' | 'signup';
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ context }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  // Handle Google authentication
  const handleGoogleAuth = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const token = credentialResponse.credential;

      if (!token) {
        setAuthError('Failed to receive authentication token from Google');
        toast.error('Failed to get authentication token from Google');
        return;
      }

      const res = await fetch(`${API_BASE}/api/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data && data.access && data.refresh) {
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
  };
  
  // Initialize Google Sign-In
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("Google Client ID is not set. Please check your environment variables.");
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google) {
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

          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            const containerWidth = buttonElement.offsetWidth;
            window.google.accounts.id.renderButton(
              buttonElement,
              {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                locale: 'en', 
                shape: 'rectangular',
                logo_alignment: 'left',
                width: containerWidth.toString(),
              }
            );
          } else {
            console.error("Google Sign-In button element not found");
          }
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
        }
      }
    };

    const handleGoogleScriptLoad = () => {
      console.log("Google script loaded");
      initializeGoogleSignIn();
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('google-loaded', handleGoogleScriptLoad);
    }

    return () => {
      window.removeEventListener('google-loaded', handleGoogleScriptLoad);
    };
  }, [context, handleGoogleAuth]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("Google script loaded successfully");
          window.dispatchEvent(new Event('google-loaded'));
        }}
        onError={() => {
          console.error("Failed to load Google script");
        }}
      />
      <div className="flex flex-col items-center w-full mt-3">
        {isLoading && (
          <div className="flex items-center justify-center mb-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-600">Processing Google sign-in...</span>
          </div>
        )}
        <div 
          id="google-signin-button" 
          className={`w-full overflow-hidden pt-[2px] pb-[2px] pl-[10px] pr-[10px] ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        ></div>
      </div>
    </>
  );
};

// Helper function to extract error messages
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

export default GoogleAuthButton;

// Type definitions for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        }
      }
    }
  }
}