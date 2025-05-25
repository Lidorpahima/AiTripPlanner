import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col text-center items-center justify-center min-h-screen bg-white">
      <Image
        src="/images/404.png"
        alt="404 Not Found"
        width={600}
        height={400}
        priority
        className="mb-8"
      />
      <h1 className="text-3xl font-bold text-gray-700 mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-500">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
} 