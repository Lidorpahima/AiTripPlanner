"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });

  }, []); 

  return (
    <>
      
      <Header />

      {/* Reverted main element, removed relative positioning and decorative container */}
      <main className="grow">

        {/* Removed Decorative background container div and its contents */}

        {children}

      </main>

      <Footer border={true} />
    </>
  );
}