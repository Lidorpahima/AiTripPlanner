/**
 * Footer Component
 * 
 * A responsive footer component that includes:
 * - Copyright information
 * - Legal links (Terms of Service, Privacy Policy)
 * - About section links
 * - Social media connections
 * - Optional border and text size customization
 * - Responsive grid layout
 */

import Link from "next/link";
import Logo from "./logo";

/**
 * Props interface for the Footer component
 * @property border - Optional boolean to control the top border visibility
 * @property showBigText - Optional boolean to control text size
 */
interface FooterProps {
  border?: boolean;
  showBigText?: boolean;
}

/**
 * Footer Component
 * 
 * Renders a responsive footer with multiple sections including
 * copyright information, legal links, about section, and social media links.
 * The layout adapts to different screen sizes using a grid system.
 */
export default function Footer({ border = true, showBigText = true }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer content grid */}
        <div
          className={`grid gap-8 py-8 sm:grid-cols-12 md:py-12 ${border ? "border-t [border-image:linear-gradient(to_right,transparent,var(--color-slate-600),transparent)1]" : ""}`}
        >
          {/* Copyright section */}
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            <div className="text-sm text-gray-300">
              &copy; AiTripPlanner.com - All rights reserved.
            </div>
          </div>

          {/* Legal links section */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* About section links */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 transition hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 transition hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social media connections */}
          <div className="space-y-2 sm:col-span-12 md:col-span-3 lg:col-span-4 lg:justify-self-start">
            <h3 className="text-sm font-medium">Connect</h3>
            <ul className="flex gap-3">
              {/* GitHub link */}
              <li>
                <Link
                  className="flex items-center justify-center text-gray-300 transition hover:text-white"
                  href="https://github.com/Lidorpahima"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.318-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.801 24 17.303 24 12 24 5.373 18.627 0 12 0z"/>
                  </svg>
                </Link>
              </li>
              {/* LinkedIn link */}
              <li>
                <Link
                  className="flex items-center justify-center text-gray-300 transition hover:text-white"
                  href="https://www.linkedin.com/in/lidor-pahima/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M20.447 20.45h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.284zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.776 13.017H3.561V9h3.552v11.45zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
