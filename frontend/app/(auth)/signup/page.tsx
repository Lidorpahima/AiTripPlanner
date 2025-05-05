'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useAuth } from '@/app/(auth)/context/AuthContext' 
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { context } from '@react-three/fiber'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

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
          messages = messages.concat(data[key].map(msg => `${key}: ${msg}`));
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
}

export default function SignUp() {
    const [formData, setFormData] = useState({
      full_name: '',
      email: '',
      password: '',
      password2: '',
    })
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
      // Clear any error when user starts typing again
      if (authError) setAuthError(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setAuthError(null);
      
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
      }

      try {
        const res = await fetch(`${API_BASE}/api/register/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        let data: any = {}; 

        try {
            data = await res.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            try{
                const textResponse = await res.text(); 
                console.error('Raw text response:', textResponse);
            } catch (textError) {
                 console.error('Failed to read response body as text:', textError);
            }
            toast.error(' Error processing server response.');
            return; 
        }

        if (res.ok) {
            if (data && data.access && data.refresh) {
                Cookies.set('access', data.access, { path: '/', expires: 7 });
                Cookies.set('refresh', data.refresh, { path: '/', expires: 7 });
                login(data.access, data.refresh); 
                toast.success('Registration successful! Redirecting...');
                setTimeout(() => {
                    router.push('/');
                }, 2500); 
            } else {
                console.error('Status OK but tokens missing in response data:', data);
                toast.error('Registration seemed successful, but failed to get authentication tokens.');
            }
        } else {
            const errorMessage = extractErrorMessages(data);
            console.error('Registration Error Response (status not OK):', data); 
            toast.error(`${errorMessage}`); 
        }

      } catch (error) {
        console.error("Network/Fetch Error:", error);
        toast.error('Network error. Please check your connection or try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Handle Google authentication
    const handleGoogleAuth = async (credentialResponse: any) => {
      try {
        setGoogleLoading(true);
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
        setGoogleLoading(false);
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
              context: 'signup',
              auto_select: false,
              ux_mode: 'popup',
              locale: 'en', // Force English language
            });

            const buttonElement = document.getElementById('google-signin-button');
            if (buttonElement) {
              // Remove the width calculation and allow the button to use full width
              window.google.accounts.id.renderButton(
                buttonElement,
                {
                  type: 'standard',
                  theme: 'outline',
                  size: 'large',
                  text: 'continue_with',
                  shape: 'rectangle',
                  logo_alignment: 'left',
                  // Width is not specified to match parent container width
                }
              );
              console.log("Google Sign-In button rendered successfully");
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
    }, [handleGoogleAuth]);

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
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 shadow-xl rounded-xl overflow-hidden w-full max-w-6xl">
          {/* Left Column - Form */}
          <div className="bg-white p-8 md:p-12">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 mb-4 relative">
                <Image 
                  src="/images/logo.png" 
                  alt="Travel Planner Logo"
                  width={128}
                  height={128}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/svg/compass.svg'; 
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">Travel Planner</h2>
              <p className="text-gray-500 mt-1 mb-6">Plan your next adventure</p>
            </div>
          
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="full_name"
                >
                  Full name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  onChange={handleChange}
                  value={formData.full_name}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                 <input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password2"
                >
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  onChange={handleChange}
                  value={formData.password2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Register'}
                </button>
                
                <div className="my-4 flex items-center">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <p className="mx-4 text-sm text-gray-500">or</p>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                
                {/* Google Sign-In Button Wrapper with loading state */}
                <div className="flex flex-col items-center w-full mt-3">
                  {googleLoading && (
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-sm text-gray-600">Processing Google sign-in...</span>
                    </div>
                  )}
                  <div 
                    id="google-signin-button" 
                    className={` w-full ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  ></div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
          
          <div className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-white flex flex-col justify-center">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-4">
                <h3 className="text-3xl font-bold">Discover the World Smarter</h3>
              </div>
              
              <p className="text-lg opacity-90 mb-8">
                Our smart travel planner handles all the details, so you can focus on what matters most - enjoying the experience.
              </p>
              
              <div className="space-y-6">
                <h4 className="text-xl font-semibold">Everything included at no cost:</h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h5 className="font-medium text-lg mb-2 flex items-center">
                      Smart Itinerary Planning
                      <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                    </h5>
                    <p className="opacity-90">AI-powered personalized routes based on your preferences and travel style</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h5 className="font-medium text-lg mb-2 flex items-center">
                      Budget Optimization
                      <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                    </h5>
                    <p className="opacity-90">Recommendations tailored to your budget with cost-saving options</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h5 className="font-medium text-lg mb-2 flex items-center">
                      Unlimited Trip Storage
                      <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                    </h5>
                    <p className="opacity-90">Save as many trip plans as you want with no storage limitations</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h5 className="font-medium text-lg mb-2 flex items-center">
                      Hidden Gems Access
                      <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                    </h5>
                    <p className="opacity-90">Discover local secrets and off-the-beaten-path attractions</p>
                  </div>
                </div>
                
                <p className="text-sm italic">
                  No credit card required. No hidden fees. No premium tier. All features are completely free forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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