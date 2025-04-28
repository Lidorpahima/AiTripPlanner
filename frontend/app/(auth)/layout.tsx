import Image from "next/image";
import Logo from "@/components/ui/logo";
import AuthBg from "@/public/images/auth-bg.svg";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="absolute z-30 w-full">
        <div className="mx-auto max-w-0xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Site branding */}
            <div className="mr-4 shrink-0">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex grow">
        <div
          className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/3"
          aria-hidden="true"
        >
          <div className="h-80 w-80 rounded-full bg-linear-to-tr from-blue-500 opacity-70 blur-[160px]"></div>
        </div>

        {/* Content */}
        <div className="w-full">
          <div className="flex h-full flex-col justify-center before:min-h-[4rem] before:flex-1 after:flex-1 md:before:min-h-[5rem]">
            <div className="px-4 sm:px-6">
              <div className="">
                <div className="py-0 md:py-20">{children}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="relative hidden w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 lg:block">
          {/* Background with gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/auth-bg.svg"
              fill
              alt="Background pattern"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-blue-50/80 to-blue-100/90"></div>
          </div>
          
          {/* Main illustration */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="max-w-[80%] max-h-[80%] relative">
              <Image
                src="/images/globe-traveler.svg"
                width={500} 
                height={500} 
                alt="Trip planner illustration"
                className="object-contain" 
                priority
              />
            </div>
          </div>
          
          {/* Earth background element */}
          <div className="absolute bottom-10 right-10 w-64 h-64 opacity-40 z-0">
            <Image 
              src="/images/earth.png"
              width={256}
              height={256}
              alt="Earth"
              className="object-contain opacity-50"
            />
          </div>
          
          {/* Bottom glow effect */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
            <div className="h-56 w-56 rounded-full border-[20px] border-blue-600/30 blur-[80px]"></div>
          </div>
        </div>
      </main>
      <ToastContainer
          position="bottom-center"
          autoClose={2000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" 
        />
    </>
  );
}
