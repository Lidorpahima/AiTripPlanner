/**
 * AuthFooter Component
 * 
 * A reusable footer component for authentication forms that provides:
 * - Navigation links between auth pages
 * - Optional terms and privacy policy links
 * - Consistent styling across auth forms
 * - Responsive design
 * - Type safety with TypeScript
 * - Accessibility features
 */

import React from 'react';
import Link from 'next/link';

/**
 * Props interface for AuthFooter component
 * @property questionText - Text to display before the link
 * @property linkText - Text for the navigation link
 * @property linkHref - URL for the navigation link
 * @property showTerms - Whether to display terms and privacy policy links
 */
interface AuthFooterProps {
  questionText: string;
  linkText: string;
  linkHref: string;
  showTerms?: boolean;
}

/**
 * AuthFooter Component
 * 
 * Renders a footer section for authentication forms with navigation links
 * and optional terms and privacy policy links.
 */
const AuthFooter: React.FC<AuthFooterProps> = ({
  questionText,
  linkText,
  linkHref,
  showTerms = false,
}) => {
  return (
    <>
      {/* Navigation link section */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {questionText}{" "}
          <Link href={linkHref} className="text-blue-600 hover:text-blue-800 font-medium">
            {linkText}
          </Link>
        </p>
      </div>
      
      {/* Terms and privacy policy section */}
      {showTerms && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
};

export default AuthFooter;