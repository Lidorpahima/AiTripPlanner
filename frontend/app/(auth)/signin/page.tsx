'use client'
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import SignInForm from "../components/SigninForm";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthFormDivider from "../components/AuthFormDivider";
export default function SignIn() {
  return (
    <AuthLayout 
      headerText="Welcome Back, Explorer!"
      subText="Log in to access your next adventure."
    >
    <>
      <SignInForm />

      <AuthFormDivider />
      <GoogleAuthButton context="signup" />


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
    </AuthLayout>
  );
}