// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-10">
      <div className="max-w-7xl px-2 mx-auto py-6">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          {/* Left section */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Brought to you by{" "}
            <Link 
              href="https://www.declankramper.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Declan
            </Link>
            {" "}&{" "}
            <Link 
              href="/contributions"
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Friends
            </Link>
          </div>

          {/* Center section */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link 
              href="/terms"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              © dkBuilds {currentYear}
            </Link>
          </div>

          {/* Right section - Strava logo */}
          <Link 
            href="https://www.strava.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/api_logo_pwrdBy_strava_horiz_gray.svg"
              alt="Powered by Strava"
              width={150}
              height={30}
              className="h-6 w-auto dark:invert"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}