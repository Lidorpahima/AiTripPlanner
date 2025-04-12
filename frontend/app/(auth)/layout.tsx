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

        <>
          {/* Right side */}
          <div className="relative my-6 mr-6 hidden w-[572px] shrink-0 overflow-hidden rounded-2xl lg:block">
            {/* Background */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -ml-24 -translate-x-1/2 -translate-y-1/2 bg-blue-50"
              aria-hidden="true"
            >
              <Image
                src={AuthBg}
                className="max-w-none"
                width={1290}
                height={1684}
                alt="Auth bg"
              />
            </div>
            {/* Illustration */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Image
                        src="../images/globe-traveler.svg"
                        width={550} 
                        height={400} 
                        alt="Traveler with globe illustration"
                        className="max-w-full max-h-full object-contain" 
                    />
            </div>
          </div>
        </>
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
