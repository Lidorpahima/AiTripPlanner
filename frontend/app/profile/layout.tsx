'use client';

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Header />
      <main className="relative z-10 -mt-14">
        {children}
      </main>
      <Footer showBigText={false}/> 
    </div>
  );
}
