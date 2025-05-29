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
    </div>
  );
}