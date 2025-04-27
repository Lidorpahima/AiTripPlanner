'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useAuth } from '@/app/(auth)/context/AuthContext' 

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const extractErrorMessages = (data: any): string => {
  if (!data) return 'An unexpected error occurred. Please try again.';
  if (typeof data === 'string') return data; // Simple string error

  let messages: string[] = [];
  if (typeof data === 'object' && data !== null) {
    // Check for DRF's common 'detail' key
    if (data.detail) {
      messages.push(data.detail);
    } else {
      // Otherwise, iterate over field errors
      for (const key in data) {
        if (Array.isArray(data[key])) {
          // Add field name for context
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
    const router = useRouter();
    const { login } = useAuth();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
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


        let data: any = {};  // תיקון שגיאת התחביר - הסרת האות 'e'

        try {
            data = await res.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            try{
                const textResponse = await res.text(); // Attempt to read as text
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
      }
    }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Create your account</h1>
      </div>

      {/* Ensure label htmlFor matches input id */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="full_name"
            >
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              onChange={handleChange}
              value={formData.full_name}
              className="form-input w-full py-2"
              type="text"
              placeholder="Lidor Pahima"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="form-input w-full py-2"
              type="email"
              placeholder="lidorpahima@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
             <input
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="form-input w-full py-2"
              type="password"
              autoComplete="new-password" // Use "new-password" for sign up
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password2"
            >
              Confirm Password
            </label>
            <input
              id="password2"
              name="password2"
              onChange={handleChange}
              value={formData.password2}
              className="form-input w-full py-2"
              type="password"
              autoComplete="new-password" // Use "new-password" for sign up
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {/* Form submission button */}
          <button type="submit" className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] cursor-pointer">
            Register
          </button>

          <div className="text-center text-sm italic text-gray-400">Or</div>
          {/* GitHub button - does not submit the form */}
          <button type="button" className="btn w-full bg-linear-to-t from-gray-900 to-gray-700 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] cursor-pointer">
            Continue with GitHub
          </button>
        </div>
      </form>

      {/* Links to terms and privacy policy */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to the{" "}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0" 
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  );
}