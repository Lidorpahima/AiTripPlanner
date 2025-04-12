'use client';

import Header from "@/components/ui/header";
import FastPlanFooter from "@/components/AnimatedWave";

export default function FastPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Header />
      <main className="relative z-10">
        {children}
      </main>

      <div className="absolute bottom-0 left-0 right-0 w-full h-64 md:h-72 lg:h-100 z-0 overflow-hidden"> 
        <FastPlanFooter className="w-full h-full" />
      </div>
    </div>
  );
}