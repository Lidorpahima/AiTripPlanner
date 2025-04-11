import Link from "next/link";
import Image from "next/image"; 
import LogoSvg from "@/public/images/logo-01.svg"; 

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Trip Planner AI">
      <Image
        src={LogoSvg}
        alt="Trip Planner AI Logo"
        width={40}
        height={40}
        priority
      />
    </Link>
  );
}
