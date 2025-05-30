/**
 * SigninForm Component
 * 
 * A form component for user authentication that handles:
 * - Email and password input
 * - Form validation
 * - API integration
 * - Error handling
 * - Loading states
 * - Success notifications
 * - Automatic redirection
 * - Token management
 */

'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/(auth)/context/AuthContext";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Extracts error messages from API response data
 * @param data - The response data from the API
 * @returns Formatted error message string
 */
const extractErrorMessages = (data: any): string => {
  if (!data) return "An unexpected error occurred. Please try again.";
  if (typeof data === "string") return data;

  let messages: string[] = [];
  if (typeof data === "object" && data !== null) {
    if (data.detail) {
      messages.push(data.detail);
    } else {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          messages = messages.concat(
            data[key].map((msg) => `${key}: ${msg}`)
          );
        } else if (typeof data[key] === "string") {
          messages.push(`${key}: ${data[key]}`);
        }
      }
    }
  }

  if (messages.length === 0) {
    return "An error occurred. Please check your details and try again.";
  }

  return messages.join("\n");
}

/**
 * SignInForm Component
 * 
 * Renders a sign-in form with email and password inputs.
 * Handles form submission, validation, and authentication flow.
 */
const SignInForm: React.FC = () => {
  // Form state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  
  /**
   * Handles input field changes
   * Updates form state with new values
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Handles form submission
   * Makes API call, handles response, and manages authentication flow
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare payload for API
    const payload = {
      username: formData.email,
      password: formData.password,
    };

    try {
      // Make API request
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      let data: any = {}; 

      // Handle response parsing
      try {
        data = await res.json();
      } catch (jsonError) {
        console.log("ENV", process.env.NEXT_PUBLIC_API_URL);
        console.error("Failed to parse JSON response:", jsonError);
        try {
          const textResponse = await res.text(); 
          console.error("Raw text response:", textResponse);
        } catch (textError) {
          console.error("Failed to read response body as text:", textError);
        }
        toast.error("Error processing server response.");
        setLoading(false);
        return; 
      }

      // Handle successful response
      if (res.ok) {
        if (data && data.access && data.refresh) {
          toast.success("Login successful! Redirecting...");
          setTimeout(() => {
            login(data.access, data.refresh);
            router.push("/");
          }, 2000); 
        } else {
          console.error("Login successful (status OK) but tokens/data missing:", data);
          toast.error("Login seemed successful, but failed to retrieve necessary data.");
          setLoading(false);
        }
      } else {
        // Handle error response
        const errorMessage = extractErrorMessages(data);
        console.error("Login Error Response:", data);
        toast.error(`${errorMessage}`);
        setLoading(false);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network/Fetch Error:", error);
      toast.error("Network error. Please check your connection or try again later.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Email input field */}
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="mail@example.com"
          autoComplete="email"
          required
        />
        {/* Password input field */}
        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>
      {/* Submit button */}
      <div className="mt-6">
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </AuthButton>
      </div>
    </form>
  );
};

export default SignInForm;