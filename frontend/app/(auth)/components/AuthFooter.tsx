import React from 'react';
import Link from 'next/link';

interface AuthFooterProps {
  questionText: string;
  linkText: string;
  linkHref: string;
  showTerms?: boolean;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  questionText,
  linkText,
  linkHref,
  showTerms = false,
}) => {
  return (
    <>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {questionText}{" "}
          <Link href={linkHref} className="text-blue-600 hover:text-blue-800 font-medium">
            {linkText}
          </Link>
        </p>
      </div>
      
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