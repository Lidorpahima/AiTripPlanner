import Hero from "@/components/hero-home";
import SectionBlob from "@/components/ui/SectionBlob";
import HowItWorksSection from "@/components/how-it-works";
import PopularDestinations from "@/components/popular-destinations";
import CallToAction from "@/components/call-to-action";
import { CompactDeviceShowcase } from "@/components/Preview";

export default function Home() {
  return (
    <>
      {/* Hero Section with Rotating Globe */}
      <section className="relative">
        <SectionBlob blobName="60.png" />
        {/* Add the Globe animation component */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
        {/* Hero Content with AOS animation */}
        <div 
          data-aos-once="true"
          data-aos="fade-up"
          data-aos-duration="1000" 
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/60 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <Hero />
        </div>
      </section>

      {/* CompactDeviceShowcase */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-100"></div>
        </div>
        <CompactDeviceShowcase />
      </section>
      
      {/* How It Works Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/svg/69.svg')] opacity-100"></div>
        </div>
        <div 
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/60 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <HowItWorksSection />
        </div>
      </section>
      
      {/* Popular Destinations Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-tl from-blue-50/80 via-white to-purple-50/80">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/wave.svg')] opacity-5"></div>
        </div>
        <div 
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/60 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <PopularDestinations />
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="relative pt-12 md:pt-20 bg-gradient-to-b from-white to-blue-50/50">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/circles.svg')] opacity-5"></div>
        </div>
        <CallToAction />
      </section>
    </>
  );
}