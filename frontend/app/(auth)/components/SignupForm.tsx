import React from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFormDivider from './AuthFormDivider';
import GoogleAuthButton from './GoogleAuthButton';
import AuthFooter from './AuthFooter';
import useAuthForm from '../hooks/useAuthForm';

const SignupForm: React.FC = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useAuthForm({
    endpoint: 'register',
    successMessage: 'Registration successful! Redirecting...',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="pt-2">
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
        >
          Register
        </AuthButton>
        
        <AuthFormDivider />
        
        {/* Google Sign-In Button */}
        <GoogleAuthButton context="signup" />
      </div>

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