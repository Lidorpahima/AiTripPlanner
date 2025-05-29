/**
 * useAuthForm Custom Hook
 * 
 * A custom hook for handling authentication form logic, including:
 * - Form state management
 * - Form submission handling
 * - API integration
 * - Error handling
 * - Loading state management
 * - Success/error notifications
 * - Automatic redirection
 * - Token management
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessages } from '../utils/authUtils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Props interface for useAuthForm hook
 * @property endpoint - API endpoint for authentication
 * @property redirectPath - Path to redirect after successful authentication
 * @property successMessage - Message to display on successful authentication
 */
interface UseAuthFormProps {
  endpoint: string;
  redirectPath?: string;
  successMessage?: string;
}

/**
 * Interface for authentication form data
 * @property full_name - User's full name (optional for signup)
 * @property email - User's email address
 * @property password - User's password
 * @property password2 - Password confirmation (optional for signup)
 */
interface SignupFormData {
  full_name?: string;
  email: string;
  password: string;
  password2?: string;
}

/**
 * useAuthForm Hook
 * 
 * Manages authentication form state and submission logic.
 * Handles API calls, error handling, and success flows.
 * 
 * @param endpoint - API endpoint for authentication
 * @param redirectPath - Path to redirect after successful authentication
 * @param successMessage - Message to display on successful authentication
 * @returns Object containing form state and handlers
 */
const useAuthForm = ({ 
  endpoint, 
  redirectPath = '/', 
  successMessage = 'Authentication successful! Redirecting...' 
}: UseAuthFormProps) => {
  // Form state management
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  /**
   * Handles form input changes
   * Updates form state and clears any existing errors
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any error when user starts typing again
    if (authError) setAuthError(null);
  };

  /**
   * Handles form submission
   * Makes API call, handles response, and manages authentication flow
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      // Make API request
      const res = await fetch(`${API_BASE}/api/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data: any = {};

      // Handle response parsing
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        try {
          const textResponse = await res.text();
          console.error('Raw text response:', textResponse);
        } catch (textError) {
          console.error('Failed to read response body as text:', textError);
        }
        toast.error('Error processing server response.');
        setIsLoading(false);
        return;
      }

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
          
          // Update auth context and handle success
          login(data.access, data.refresh);
          toast.success(successMessage);
          setTimeout(() => {
            router.push(redirectPath);
          }, 2000);
        } else {
          console.error('Status OK but tokens missing in response data:', data);
          toast.error('Authentication seemed successful, but failed to get authentication tokens.');
        }
      } else {
        // Handle error response
        const errorMessage = extractErrorMessages(data);
        setAuthError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network/Fetch Error:", error);
      toast.error('Network error. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    authError,
    handleChange,
    handleSubmit,
  };
};

export default useAuthForm;