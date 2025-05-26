/**
 * Logo Component
 * 
 * A reusable component that displays the application logo.
 * Features:
 * - Optional link wrapping
 * - Image optimization with Next.js Image
 * - Hover animation effect
 * - Priority loading for better performance
 * - Accessible link and image labels
 */

import Link from "next/link";
import Image from "next/image"; 
import LogoImage from "@/public/images/logo.png"; 

/**
 * Props interface for the Logo component
 * @property skipLink - When true, renders the logo without wrapping it in a Link component
 */
interface LogoProps {
  skipLink?: boolean;
}

/**
 * Logo Component
 * 
 * Renders the application logo with optional link wrapping.
 * Uses Next.js Image component for optimized image loading and
 * includes hover animation effects.
 */
export default function Logo({ skipLink = false }: LogoProps) {
  // Logo Image Component with hover effect
  const logoImage = (
    <Image
      src={LogoImage}
      alt="Trip Planner AI Logo"
      width={40}
      height={40}
      priority
      className="hover:scale-130 transition-all duration-300"
    />
  );
  
  // Return just the image if skipLink is true
  if (skipLink) {
    return logoImage;
  }
  
  // Return the image wrapped in a link to home page
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Trip Planner AI">
      {logoImage}
    </Link>
  );
}
