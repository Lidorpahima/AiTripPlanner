"use client";
import React from "react";
import { toast } from "react-toastify";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    if (!email) {
      toast.error("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    const payload = { email }; 

    try {
      const res = await fetch(`${API_BASE}/api/password-reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Password reset email sent!"); 
        setEmail('');
      } else {
        let errorMessage = "Failed to send password reset email.";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (jsonError) {
          console.error("Could not parse error response:", jsonError);
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Network/Fetch Error:", error);
      toast.error("Network error. Please check your connection or try again later.");
    } finally {
        setIsLoading(false); 
    }
  };
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Reset password</h1>
      </div>

      {/* Form */}
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
              className="form-input w-full py-2"
              type="email"
              value={email}
              placeholder="mail@email.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>
        <div className="mt-6">
        <button
            type="submit"
            className={`btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            disabled={isLoading}
          >
            
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </>
  );
}
