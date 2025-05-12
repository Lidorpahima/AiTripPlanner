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


      
      {/* How It Works Section */}
      <section className="relative py-12 md:py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 -top-10 bg-[url('/svg/87.png')] bg-cover bg-center opacity-100"></div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        <div 
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/70 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <HowItWorksSection />
        </div>
      </section>
      
      {/* Popular Destinations Section */}
      <section className="relative py-12 md:py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 -top-10 bg-[url('/svg/37.png')] bg-cover bg-center opacity-100"></div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
          <div className="absolute inset-0 bg-white/40"></div>
        </div>
        <div 
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/70 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <PopularDestinations />
        </div>
      </section>

      {/* CompactDeviceShowcase */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/svg/80.png')] bg-cover bg-center opacity-80"></div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <CompactDeviceShowcase />
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('/svg/cca5022c86f67861746d7cf2eb486de8.gif')] bg-cover bg-center opacity-90"></div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        </div>
        <div className="relative z-10">
          <CallToAction />
        </div>
      </section>
    </>
  );
}