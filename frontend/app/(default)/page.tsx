import Hero from "@/components/hero-home";
import SectionBlob from "@/components/ui/SectionBlob";
import HowItWorksSection from "@/components/how-it-works";
import PopularDestinations from "@/components/popular-destinations";
import TestimonialsSection from "@/components/testimonials";
import CallToAction from "@/components/call-to-action";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <SectionBlob blobName="main.jpg" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Hero />
        </div>
      </section>


      {/* How It Works Section */}
      <section className="relative">
        <SectionBlob blobName="howitworks.jpg" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <HowItWorksSection />
        </div>
      </section>


      {/* Popular Destinations Section */}
      <section className="relative">
        <SectionBlob blobName="main.jpg" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <PopularDestinations />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative">
        <SectionBlob blobName="howitworks.jpg" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TestimonialsSection />
        </div>
      </section>

      {/* Call To Action Section (No Blob) */}
      <section className="relative">
          <CallToAction />
      </section>
    </>
  );
}