/**
 * Destinations Page Component
 * 
 * The main destinations page that provides:
 * - Display of all available destinations
 * - Consistent layout with header and footer
 * - Responsive design
 * - Navigation structure
 */

import AllDestinations from '@/components/all-destinations';
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

/**
 * DestinationsPage Component
 * 
 * Renders the main destinations page with:
 * - Header navigation
 * - All destinations display
 * - Footer section
 * 
 * Uses a flex column layout to ensure proper spacing and structure
 */
export default function DestinationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AllDestinations />
      </main>
      <Footer />
    </div>
  );
} 