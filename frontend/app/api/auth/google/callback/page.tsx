"use client";

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/(auth)/context/AuthContext';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshAuthState } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (Cookies.get('access')) {
      router.replace('/');
      return;
    }
    const code = searchParams.get('code');
    if (code) {
      fetch(`${NEXT_PUBLIC_API_URL}/api/auth/google/callback/?code=${code}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            console.error('Google auth error details:', data);
            throw new Error(data.error || data.details || 'Failed to sign in with Google');
          }
          return data;
        })
        .then(data => {
          if (data.access && data.refresh) {
            login(data.access, data.refresh);
            refreshAuthState();
            toast.success('Successfully signed in with Google!');
            router.replace('/'); 
          } else {
            throw new Error('Failed to get authentication tokens');
          }
        })
        .catch((error) => {
          console.error('Google auth error:', error);
          toast.error(error.message || 'Failed to sign in with Google');
          router.replace('/signin');
        });
    } else {
      toast.error('Failed to sign in with Google');
      router.replace('/signin');
    }
  }, [router, searchParams, login, refreshAuthState]);

  return (
    <div style={{textAlign: 'center', marginTop: '3rem'}}>
      <h2>Signing you in with Google...</h2>
      <p>If you are not redirected automatically, <a href="/">click here</a>.</p>
    </div>
  );
}

export default function GoogleCallbackRedirect() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackInner />
    </Suspense>
  );
} 