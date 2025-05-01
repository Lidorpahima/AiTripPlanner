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
      <section className="relative py-12 md:py-20"> {/* Added padding to section for spacing */}
        <SectionBlob blobName="main.jpg" />
        {/* Apply glassmorphism to the inner container - Adjusted transparency and width */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/75 backdrop-blur-lg rounded-xl p-8 shadow-lg"> {/* Changed max-w-6xl to max-w-7xl and bg-white/20 to bg-white/30 */}
          <Hero />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-12 md:py-20"> {/* Added padding to section for spacing */}
        <SectionBlob blobName="howitworks.jpg" />
        {/* Apply glassmorphism to the inner container - Adjusted transparency and width */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-lg"> {/* Changed max-w-6xl to max-w-7xl and bg-white/20 to bg-white/30 */}
          <HowItWorksSection />
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="relative py-12 md:py-20"> {/* Added padding to section for spacing */}
        <SectionBlob blobName="main.jpg" />
        {/* Apply glassmorphism to the inner container - Adjusted transparency and width */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-lg"> {/* Changed max-w-6xl to max-w-7xl and bg-white/20 to bg-white/30 */}
          <PopularDestinations />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-12 md:py-20"> {/* Added padding to section for spacing */}
        <SectionBlob blobName="howitworks.jpg" />
        {/* Apply glassmorphism to the inner container - Adjusted transparency and width */}
        <div className="mx-auto max-w-7xl px-4 sm:px-7 relative z-10 bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-lg"> {/* Changed max-w-6xl to max-w-7xl and bg-white/20 to bg-white/30 */}
          <TestimonialsSection />
        </div>
      </section>

      {/* Call To Action Section (No Blob, so no glassmorphism needed here unless desired differently) */}
      <section className="relative py-12 md:py-20"> {/* Added padding for consistency */}
        {/* Removed the extra div wrapper here as there's no blob */}
        <CallToAction />
      </section>
    </> // Ensure the closing fragment tag is present
  );
}