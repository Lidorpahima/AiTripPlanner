'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/context/AuthContext"; 

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

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
        toast.error(" Error processing server response.");
        return; 
      }
      if (res.ok) {

        if (data && data.access && data.refresh) {
          toast.success(" Login successful! Redirecting...");
          setTimeout(() => {
            login(data.access, data.refresh);
            router.push("/");
          }, 2000); 
        } else {
          console.error("Login successful (status OK) but tokens/data missing:", data);
          toast.error("Login seemed successful, but failed to retrieve necessary data.");
        }
      } else {
        const errorMessage = extractErrorMessages(data);
        console.error("Login Error Response:", data);
        toast.error(` ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network/Fetch Error:", error);
      toast.error(" Network error. Please check your connection or try again later.");
    }
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Sign in to your account</h1>
      </div>

      {/* Form with onSubmit handler */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
              value={formData.email}
              onChange={handleChange}
              className="form-input w-full py-2"
              type="email"
              placeholder="Lidorpahima@email.com"
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
              value={formData.password}
              onChange={handleChange}
              className="form-input w-full py-2"
              type="password"
              autoComplete="current-password" 
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          {/* Button with type="submit" */}
          <button
            type="submit"
            className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Bottom link */}
      <div className="mt-6 text-center">
        <Link
          className="text-sm text-gray-700 underline hover:no-underline"
          href="/reset-password" 
        >
          Forgot password?
        </Link>
      </div>
      <div className="mt-4 text-center">
        <Link
          className="text-sm text-gray-700 underline hover:no-underline"
          href="/signup" 
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </>
  );
}