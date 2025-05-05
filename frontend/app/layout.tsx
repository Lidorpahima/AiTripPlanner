'use client'; 

import { useEffect } from 'react'; 
import Script from 'next/script'; // Import the Script component
import "./css/style.css";
import { AuthProvider } from "@/app/(auth)/context/AuthContext";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-out',
      mirror: true,
      anchorPlacement: 'top-bottom',
    });

    const ensureCsrfCookie = async () => {
      console.log("Attempting to fetch CSRF cookie endpoint..."); 
      try {
        await fetch(`${API_BASE}/api/csrf/`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log("CSRF cookie endpoint fetched (cookie should be set if backend responded correctly).");

        console.log("Layout: Checking if CSRF cookie is set...");
        const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        if (csrfCookie) {
          console.log("Layout: CSRF cookie found.", csrfCookie);
        } else {
          console.warn("Layout: CSRF cookie not found.");
        }
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
          <Script id="brevo-config" strategy="beforeInteractive">
            {`
              (function(d, w, c) {
                  w.BrevoConversationsID = '6815fb310a9d3d601a01fe9e';
                  w[c] = w[c] || function() {
                      (w[c].q = w[c].q || []).push(arguments);
                  };
                  var s = d.createElement('script');
                  s.async = true;
                  s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
                  if (d.head) d.head.appendChild(s);
              })(document, window, 'BrevoConversations');
            `}
          </Script>
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