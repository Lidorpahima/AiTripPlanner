import AllDestinations from '@/components/all-destinations';
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

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