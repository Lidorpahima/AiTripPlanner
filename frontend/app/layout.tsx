'use client'; 

import { useEffect } from 'react'; 
import "./css/style.css";
import { AuthProvider } from "@/app/(auth)/context/AuthContext";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


const API_BASE = process.env.NEXT_PUBLIC_API_URL ;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    const ensureCsrfCookie = async () => {
      console.log("Attempting to fetch CSRF cookie endpoint..."); 
      try {
        await fetch(`${API_BASE}/api/csrf/`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log("CSRF cookie endpoint fetched (cookie should be set if backend responded correctly).");
      } catch (err) {
        console.error("Failed to fetch CSRF token endpoint:", err);
      }
    };
    
    ensureCsrfCookie();
  }, []); 


  return (
    <html lang="en" className="scroll-smooth">
      <head>
          <title>Ai Trip Planner</title> 
      </head>
      <body
        className={`${inter.variable} bg-gray-50 font-inter tracking-tight text-gray-900 antialiased`}
      >
         <AuthProvider> 
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            {children}
          </div>
        </AuthProvider>

        <ToastContainer
            position="bottom-left" 
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" 
        />
      </body>
    </html>
  );
}