import Link from "next/link";
import Image from "next/image"; 
import LogoSvg from "@/public/images/logo-01.svg"; 

interface LogoProps {
  skipLink?: boolean; // When true, doesn't wrap logo in a Link component
}

export default function Logo({ skipLink = false }: LogoProps) {
  const logoImage = (
    <Image
      src={LogoSvg}
      alt="Trip Planner AI Logo"
      width={40}
      height={40}
      priority
    />
  );
  
  if (skipLink) {
    return logoImage;
  }
  
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Trip Planner AI">
      {logoImage}
    </Link>
  );
}
