/**
 * SignIn Page Component
 * 
 * The main sign-in page that provides:
 * - User authentication form
 * - Google authentication option
 * - Password reset link
 * - Sign-up navigation
 * - Consistent layout with other auth pages
 * - Responsive design
 */

'use client'
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import SignInForm from "../components/SigninForm";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthFormDivider from "../components/AuthFormDivider";

/**
 * SignIn Page Component
 * 
 * Renders the sign-in page with authentication form, Google sign-in option,
 * and navigation links for password reset and sign-up.
 */
export default function SignIn() {
  return (
    <AuthLayout 
      headerText="Welcome Back, Explorer!"
      subText="Log in to access your next adventure."
    >
    <>
      {/* Main sign-in form */}
      <SignInForm />

      {/* Divider between regular and Google sign-in */}
      <AuthFormDivider />
      
      {/* Google Sign-In button */}
      <GoogleAuthButton context="signin" />

      {/* Password reset link */}
      <div className="mt-6 text-center">
        <Link
          className="text-sm text-gray-700 underline hover:no-underline"
          href="/reset-password" 
        >
          Forgot password?
        </Link>
      </div>

      {/* Sign-up navigation link */}
      <div className="mt-4 text-center">
        <Link
          className="text-sm text-gray-700 underline hover:no-underline"
          href="/signup" 
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </>
    </AuthLayout>
  );
}