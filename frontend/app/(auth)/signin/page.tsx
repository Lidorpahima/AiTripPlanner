'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/context/AuthContext"; 
// Helper function to extract error messages (assuming it's correct)
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
    e.preventDefault(); // Prevent default form submission
    const payload = {
      username: formData.email,
      password: formData.password,
    };

    try {
      // IMPORTANT: Verify this is the correct URL for your login API
      const res = await fetch("http://localhost:8000/api/login/ ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {}; // Initialize data variable

      try {
        // Attempt to parse the response body as JSON
        data = await res.json();
      } catch (jsonError) {
        // Handle cases where response is not valid JSON
        console.error("Failed to parse JSON response:", jsonError);
        try {
          const textResponse = await res.text(); // Attempt to read as text
          console.error("Raw text response:", textResponse);
        } catch (textError) {
          console.error("Failed to read response body as text:", textError);
        }
        toast.error(" Error processing server response.");
        return; // Exit if JSON parsing fails
      }

      // Check if the request was successful (status code 2xx)
      if (res.ok) {
        // If successful, verify that the expected tokens are present
        // Adjust 'access' and 'refresh' if your API uses different key names
        if (data && data.access && data.refresh) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          toast.success(" Login successful! Redirecting...");
          setTimeout(() => {
            login(data.access, data.refresh);
            router.push("/");
          }, 2000); 
        } else {
          // Edge case: Status OK but tokens/expected data missing
          console.error("Login successful (status OK) but tokens/data missing:", data);
          toast.error("Login seemed successful, but failed to retrieve necessary data.");
        }
      } else {
        // If the request failed (status code not 2xx)
        const errorMessage = extractErrorMessages(data);
        console.error("Login Error Response:", data);
        toast.error(` ${errorMessage}`);
      }
    } catch (error) {
      // Handle network errors (fetch itself failed)
      console.error("Network/Fetch Error:", error);
      toast.error(" Network error. Please check your connection or try again later.");
    }
  }

  return (
    // Removed redundant outer Fragment
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
              name="email" // Ensure name matches state key
              value={formData.email}
              onChange={handleChange}
              className="form-input w-full py-2"
              type="email"
              placeholder="Lidorpahima@email.com"
              autoComplete="email" // Use "email" for autocomplete
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
              name="password" // Ensure name matches state key
              value={formData.password}
              onChange={handleChange}
              className="form-input w-full py-2"
              type="password"
              autoComplete="current-password" // Use "current-password" for login
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
          href="/reset-password" // Link to password reset page
        >
          Forgot password?
        </Link>
      </div>
    </>
  );
}