/**
 * SignupForm Component
 * 
 * A form component for user registration that handles:
 * - Full name input
 * - Email input
 * - Password and confirmation input
 * - Form validation
 * - Google authentication integration
 * - Form submission
 * - Loading states
 * - Navigation to sign-in
 * - Terms and conditions display
 */

import React from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFormDivider from './AuthFormDivider';
import GoogleAuthButton from './GoogleAuthButton';
import AuthFooter from './AuthFooter';
import useAuthForm from '../hooks/useAuthForm';

/**
 * SignupForm Component
 * 
 * Renders a registration form with user details input fields.
 * Integrates with authentication hooks and Google sign-in.
 * Provides navigation to sign-in page and terms display.
 */
const SignupForm: React.FC = () => {
  // Use custom hook for form handling
  const { formData, isLoading, handleChange, handleSubmit } = useAuthForm({
    endpoint: 'register',
    successMessage: 'Registration successful! Redirecting...',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full name input field */}
      <AuthInput
        id="full_name"
        name="full_name"
        type="text"
        label="Full name"
        value={formData.full_name || ''}
        onChange={handleChange}
        placeholder="Your Name"
        required
      />
      
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
        autoComplete="new-password"
        required
      />
      
      {/* Password confirmation input field */}
      <AuthInput
        id="password2"
        name="password2"
        type="password"
        label="Confirm Password"
        value={formData.password2 || ''}
        onChange={handleChange}
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />

      {/* Form actions section */}
      <div className="pt-2">
        {/* Submit button */}
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
        >
          Register
        </AuthButton>
        
        {/* Divider between regular and Google sign-in */}
        <AuthFormDivider />
        
        {/* Google Sign-In Button */}
        <GoogleAuthButton context="signup" />
      </div>

      {/* Footer with sign-in link and terms */}
      <AuthFooter 
        questionText="Already have an account?"
        linkText="Sign in here"
        linkHref="/signin"
        showTerms
      />
    </form>
  );
};

export default SignupForm;