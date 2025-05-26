/**
 * LoginForm Component
 * 
 * A form component for user authentication that includes:
 * - Email and password input fields
 * - Form validation
 * - Loading state handling
 * - Google authentication option
 * - Password reset link
 * - Registration link
 * - Error handling
 */

import React from 'react';
import Link from 'next/link';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFormDivider from './AuthFormDivider';
import GoogleAuthButton from './GoogleAuthButton';
import AuthFooter from './AuthFooter';
import useAuthForm from '../hooks/useAuthForm';

/**
 * LoginForm Component
 * 
 * Renders a login form with email and password fields,
 * Google authentication option, and links for password reset
 * and registration. Uses the useAuthForm hook for form state
 * management and submission handling.
 */
const LoginForm: React.FC = () => {
  // Form state and handlers from custom hook
  const { formData, isLoading, handleChange, handleSubmit } = useAuthForm({
    endpoint: 'login',
    successMessage: 'Login successful! Redirecting...',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email input field */}
      <AuthInput
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email@example.com"
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

      {/* Password reset link */}
      <div className="flex justify-end">
        <Link 
          href="/reset-password" 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Forgot password?
        </Link>
      </div>
      
      {/* Form actions section */}
      <div className="pt-2">
        {/* Submit button */}
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
        >
          Sign In
        </AuthButton>
        
        {/* Divider between regular and social login */}
        <AuthFormDivider />
        
        {/* Google authentication button */}
        <GoogleAuthButton context="signin" />
      </div>

      {/* Registration link footer */}
      <AuthFooter 
        questionText="Don't have an account?"
        linkText="Register here"
        linkHref="/signup"
        showTerms={false}
      />
    </form>
  );
};

export default LoginForm;