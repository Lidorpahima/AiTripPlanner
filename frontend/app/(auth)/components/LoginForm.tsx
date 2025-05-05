import React from 'react';
import Link from 'next/link';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFormDivider from './AuthFormDivider';
import GoogleAuthButton from './GoogleAuthButton';
import AuthFooter from './AuthFooter';
import useAuthForm from '../hooks/useAuthForm';

const LoginForm: React.FC = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useAuthForm({
    endpoint: 'login',
    successMessage: 'Login successful! Redirecting...',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        autoComplete="current-password"
        required
      />

      <div className="flex justify-end">
        <Link 
          href="/reset-password" 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Forgot password?
        </Link>
      </div>
      
      <div className="pt-2">
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
        >
          Sign In
        </AuthButton>
        
        <AuthFormDivider />
        
        {/* Google Sign-In Button */}
        <GoogleAuthButton context="signin" />
      </div>

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