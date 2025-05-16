"use client";
import Image from "next/image";
import { Lobster } from "next/font/google";

import ImgTokyo from "@/public/images/destinations/rhome.jpg";
import ImgRome from "@/public/images/destinations/lhero.jpg";
import ImgParis from "@/public/images/destinations/parisHero.jpg";
import ImgBali from "@/public/images/destinations/mHero.png";

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HeroHome() {
  return (
    <section className="relative overflow-hidden">


      {/* Main content container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-12 pt-5 md:pb-20 md:pt-28">
          {/* Adjusted flex container for single main column now */} 
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-8">
            {/* Left Column (Text Content) - Adjusted width */}
            <div className="lg:w-1/2">
              {/* Section header */}
              <div className="pb-8 text-left md:pb-12 pt-7">
                <h1
                  className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl "
                  data-aos="zoom-y-out"
                  data-aos-once="true"
                  data-aos-delay={150}
                >
                  Pick Your Dates, <br className="max-lg:hidden" />We'll<span className={`${lobster.className} text-indigo-600`}>  Plan the Rest. </span>
                </h1>
                <div className="max-w-3xl">
                  <p
                    className="mb-8 text-lg text-gray-700"
                    data-aos="zoom-y-out"
                    data-aos-once="true"
                    data-aos-delay={300}
                  >
                    Smart itineraries with routes, sights, and local events.
                  </p>
                  {/* Buttons */}
                  <div
                    className="max-w-xs sm:flex sm:max-w-none sm:justify-start"
                    data-aos="zoom-y-out"
                    data-aos-delay={450}
                  >
                    <a
                      className="btn group mb-4 w-full  text-white bg-indigo-600 hover:text-white sm:mb-0 sm:w-auto"
                      href="/fastplan" 
                    >
                      <span className="relative inline-flex items-center">
                        Plan Your Journey</span>{" "}
                        <span className="ml-1 tracking-normal transition-transform group-hover:translate-x-0.5">
                          <img 
                            src="https://images.emojiterra.com/google/noto-emoji/animated-emoji/1f680.gif" 
                            alt="Rocket" 
                            width="20" 
                            height="20" 
                          />
                        </span>
                    </a>
                    {/* Learn More Button - Changed to Watch Demo */}
                    <a
                      className="btn group w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white sm:ml-4 sm:w-auto flex items-center justify-center shadow-sm"
                      href="#" // Changed href to #
                    >
                       {/* Added Play Icon SVG */}
                       <svg className="mr-2 h-4 w-4 shrink-0 fill-current text-indigo-600 group-hover:text-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                           <path d="M15.679 7.126a.998.998 0 0 0-.023-.113l-.002-.005a1.005 1.005 0 0 0-.144-.27L1.593.324A.999.999 0 0 0 .141.996v14.008a.999.999 0 0 0 1.452.874l13.918-6.409a1 1 0 0 0 .168-.873Z"/>
                       </svg>
                       <span>Watch <span className={`${lobster.className} text-indigo-600 group-hover:text-white`}>Magic</span></span> {/* Changed text, ensure nested span also changes color on hover */}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Restore Right Column (Image Grid) */}
            <div className="grid w-full grid-cols-3 grid-rows-2 gap-4 lg:w-1/2">
                 {/* Tokyo: Takes more space top left */}
                 <div className="col-span-2 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                     <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgTokyo} alt="Tokyo" priority />
                 </div>
                 {/* Paris: Small top right */}
                 <div className="col-span-1 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                     <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgParis} alt="Paris" />
                 </div>
                 {/* Rome: Small bottom left */}
                 <div className="col-span-1 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                     <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgRome} alt="Rome" />
                 </div>
                 {/* Bali: Larger bottom right */}
                 <div className="col-span-2 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                     <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgBali} alt="Bali" />
                 </div>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
}
