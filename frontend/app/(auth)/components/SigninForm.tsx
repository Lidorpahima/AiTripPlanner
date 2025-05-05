'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/(auth)/context/AuthContext";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

const SignInForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      username: formData.email,
      password: formData.password,
    };

    try {
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {}; 

      try {
        data = await res.json();
      } catch (jsonError) {
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
        const errorMessage = extractErrorMessages(data);
        console.error("Login Error Response:", data);
        toast.error(`${errorMessage}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Network/Fetch Error:", error);
      toast.error("Network error. Please check your connection or try again later.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="emaila@email.com"
          autoComplete="email"
          required
        />
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
      <div className="mt-6">
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </AuthButton>
      </div>
    </form>
  );
};

export default SignInForm;