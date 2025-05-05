import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessages } from '../utils/authUtils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface UseAuthFormProps {
  endpoint: string;
  redirectPath?: string;
  successMessage?: string;
}

interface SignupFormData {
  full_name?: string;
  email: string;
  password: string;
  password2?: string;
}

const useAuthForm = ({ 
  endpoint, 
  redirectPath = '/', 
  successMessage = 'Authentication successful! Redirecting...' 
}: UseAuthFormProps) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any error when user starts typing again
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE}/api/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data: any = {};

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
          toast.success(successMessage);
          setTimeout(() => {
            router.push(redirectPath);
          }, 2000);
        } else {
          console.error('Status OK but tokens missing in response data:', data);
          toast.error('Authentication seemed successful, but failed to get authentication tokens.');
        }
      } else {
        const errorMessage = extractErrorMessages(data);
        setAuthError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
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