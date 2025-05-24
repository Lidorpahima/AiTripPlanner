'use client';

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function FastPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10">
      <Header />
      <main className="relative">
        {children}
      </main>
      <Footer/>
      <div className="absolute bottom-0 left-0 right-0 w-full h-64 md:h-72 lg:h-100 z-0 overflow-hidden"> 
      </div>
    </div>
  );
}