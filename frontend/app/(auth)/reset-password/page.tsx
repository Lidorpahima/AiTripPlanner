/**
 * Reset Password Page Component
 * 
 * A page component for password reset functionality that provides:
 * - Email input for password reset request
 * - Form validation
 * - API integration
 * - Loading states
 * - Success/error notifications
 * - Responsive design
 */

"use client";
import React from "react";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * ResetPassword Page Component
 * 
 * Renders a form for requesting password reset via email.
 * Handles form submission, validation, and API integration.
 */
export default function ResetPassword() {
  // Form state management
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  /**
   * Handles form submission for password reset request
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    // Validate email input
    if (!email) {
      toast.error("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    const payload = { email }; 

    try {
      // Make API request for password reset
      const res = await fetch(`${API_BASE}/api/password-reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle successful response
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Password reset email sent!"); 
        setEmail('');
      } else {
        // Handle error response
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
      // Handle network errors
      console.error("Network/Fetch Error:", error);
      toast.error("Network error. Please check your connection or try again later.");
    } finally {
        setIsLoading(false); 
    }
  };

  return (
    <AuthLayout
      headerText="Reset Your Password"
      subText="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email input field */}
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mail@example.com"
          autoComplete="email"
          required
        />

        {/* Submit button */}
        <div className="pt-2">
          <AuthButton 
            type="submit" 
            isLoading={isLoading}
          >
            Reset Password
          </AuthButton>
        </div>

        {/* Back to sign in link */}
        <div className="mt-4 text-center">
          <Link
            className="text-sm text-gray-700 underline hover:no-underline"
            href="/signin"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
