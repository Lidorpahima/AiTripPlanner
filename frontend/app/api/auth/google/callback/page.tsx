"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
const NEXT_PUBLIC_API_URL=process.env.NEXT_PUBLIC_API_URL;

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetch(`${NEXT_PUBLIC_API_URL}/api/auth/google/callback/?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.access && data.refresh) {
            Cookies.set('access', data.access);
            Cookies.set('refresh', data.refresh);
            window.location.href = '/';
          } else {
            router.replace('/login?error=google');
          }
        })
        .catch(() => {
          router.replace('/login?error=google');
        });
    } else {
      router.replace('/login?error=google');
    }
  }, [router, searchParams]);

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