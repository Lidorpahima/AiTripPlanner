/**
 * 404 Not Found Page
 * 
 * A custom 404 error page that displays when a user navigates to a non-existent route.
 * Features include:
 * - Centered layout with custom 404 illustration
 * - Clear error message and description
 * - Responsive design
 * - Priority image loading for better UX
 */

import Image from 'next/image';

/**
 * NotFound Component
 * 
 * Renders a user-friendly 404 error page with an illustration
 * and helpful message to guide users back to valid routes.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col text-center items-center justify-center min-h-screen bg-white">
      {/* 404 illustration with priority loading */}
      <Image
        src="/images/404.png"
        alt="404 Not Found"
        width={600}
        height={400}
        priority
        className="mb-8"
      />
      {/* Error heading */}
      <h1 className="text-3xl font-bold text-gray-700 mb-2">404 - Page Not Found</h1>
      {/* Error description */}
      <p className="text-lg text-gray-500">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
} 