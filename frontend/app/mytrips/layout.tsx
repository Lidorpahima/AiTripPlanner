// app/my-trips/layout.tsx
'use client'; 

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
      <main className="flex-grow relative z-10 py-8 md:py-12"> 
        {children} 
      </main>
      <Footer showBigText={false} /> 
    </div>
  );
}
