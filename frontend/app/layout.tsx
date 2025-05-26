/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps the entire application.
 * It includes:
 * - Global styles and fonts
 * - Authentication context
 * - CSRF token initialization
 * - Toast notifications
 * - Brevo chat widget
 * - AOS animations
 */

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

// Initialize Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// API configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-out',
      mirror: true,
      anchorPlacement: 'top-bottom',
    });

    // Ensure CSRF token is available
    const ensureCsrfCookie = async () => {
      try {
        await fetch(`${API_BASE}/api/csrf/`, {
          method: 'GET',
          credentials: 'include'
        });
      } catch (err) {
        console.error("Failed to fetch CSRF token endpoint:", err);
      }
    };
    
    ensureCsrfCookie();
  }, []); 

  return (
    <html lang="en" className="scroll-smooth">
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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