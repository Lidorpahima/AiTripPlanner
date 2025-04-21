'use client';
import Link from "next/link";
import Logo from "./logo";
import { useAuth } from "@/app/(auth)/context/AuthContext";

export default function Header() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex items-center"> {/* Removed flex-1 */}
            <Logo />
          </div>

          {/* Desktop sign in links */}
          <ul className="flex items-center justify-end gap-3">
            {
              isLoading ? (
                // Placeholder while loading auth state
                <li className="h-8 w-20 animate-pulse rounded bg-gray-200"></li>
              ) : isAuthenticated ? (
                // User is logged in - Show Logout button
                <>
                <li>
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Profile
                    </Link>
                </li>
                <li>
                    <Link
                      href="/mytrips"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      My Trips
                    </Link>
                </li>
                <li>
                    <Link
                      href="/fastplan"
                      className="btn-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    >
                      Plan a Trip
                    </Link>
                </li>
                <li>
                    <button
                      onClick={logout} // Call the logout function from context
                      className="btn-sm bg-red-600 text-white shadow-sm hover:bg-red-700"
                    >
                      Logout
                    </button>
                </li>
                </>
              ) : (
                // User is not logged in - Show Login and Register links
                <> {/* Use Fragment to group multiple list items */}
                  <li>
                    <Link
                      href="/signin"
                      className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="btn-sm bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-900"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )
            }
          </ul>
        </div>
      </div>
    </header>
  );
}