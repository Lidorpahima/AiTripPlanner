export const metadata = {
  title: "Home - Simple",
  description: "Page description",
};

import Hero from "@/components/hero-home";
import FeaturesPlanet from "@/components/features-planet";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>
      <FeaturesPlanet />
    </>
  );
}
