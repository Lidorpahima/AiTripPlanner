'use client'

import React from 'react';
import AuthLayout from '../components/AuthLayout';
import SignupForm from '../components/SignupForm';

export default function SignUp() {
  return (
    <AuthLayout
      headerText="Travel Planner"
      subText="Plan your next adventure"
    >
      <SignupForm />
    </AuthLayout>
  );
}