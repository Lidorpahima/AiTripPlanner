/**
 * SignUp Page Component
 * 
 * The main sign-up page that provides:
 * - User registration form
 * - Google authentication option
 * - Terms and conditions display
 * - Sign-in navigation
 * - Consistent layout with other auth pages
 * - Responsive design
 */

'use client'

import React from 'react';
import AuthLayout from '../components/AuthLayout';
import SignupForm from '../components/SignupForm';

/**
 * SignUp Page Component
 * 
 * Renders the sign-up page with registration form and related components.
 * Uses the shared AuthLayout for consistent styling and structure.
 */
export default function SignUp() {
  return (
    <AuthLayout
      headerText="Travel Planner"
      subText="Plan your next adventure"
    >
      {/* Registration form component */}
      <SignupForm />
    </AuthLayout>
  );
}