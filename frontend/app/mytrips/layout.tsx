// app/mytrips/layout.tsx
'use client'; 

import { Suspense } from 'react';
import Header from "@/components/ui/header"; 
import Footer from "@/components/ui/footer"; 

export default function MyTripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100"> 
      <Header />
      <main className="flex-grow relative z-10 py-10"> 
        <Suspense fallback={<div>Loading...</div>}>
          {children} 
        </Suspense>
      </main>
      <Footer showBigText={false} /> 
    </div>
  );
}
