import Hero from "@/components/hero-home";
import SectionBlob from "@/components/ui/SectionBlob";
import HowItWorksSection from "@/components/how-it-works";
import PopularDestinations from "@/components/popular-destinations";
import TestimonialsSection from "@/components/testimonials";
import CallToAction from "@/components/call-to-action";
import { BudgetPlanner } from "@/components/budget-planner";
import { EfforlessPlanning } from "@/components/EfforlessPlanning";
import { TravelToolkit } from "@/components/TravelToolkit";

export default function Home() {
  return (
    <>
      {/* Hero Section with Rotating Globe */}
      <section className="relative py-12 md:py-20">
        <SectionBlob blobName="Mobile Header Light - 1.jpg" />
        {/* Add the Globe animation component */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
        {/* Hero Content with AOS animation */}
        <div 
          data-aos="fade-up"
          data-aos-duration="1000" 
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/100 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <Hero />
        </div>
      </section>

      {/* EfforlessPlanning */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
          <EfforlessPlanning />
      </section>

        {/* Budget planner*/}
        <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
          <BudgetPlanner />
      </section>
      
      {/* TravelToolkit */}
      <section className="relative py-12 md:py-20">
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
        
          <TravelToolkit />
      </section>
      
      {/* How It Works Section */}
      <section className="relative py-12 md:py-20">
        {/* Add the Globe animation component */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
        <div 
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/100 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <HowItWorksSection />
        </div>
      </section>
      

      {/* Popular Destinations Section */}
      <section className="relative py-12 md:py-20">
        <div 
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 bg-white/100 backdrop-blur-lg rounded-xl p-8 shadow-xl border-2 border-blue-200"        >
          <PopularDestinations />
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="relative pt-12 md:pt-20">
          <CallToAction />
      </section>
    </>
  );
}