import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-[#D4ADD9] z-1 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">

          {/* ===== CHILDREN (FORM LOGIN / SIGNUP) ===== */}
          {children}

          {/* ===== GRADIENT SIDE IMAGE / DECOR ===== */}
          <div className="lg:w-1/2 w-full h-full bg-gradient-to-br 
                          from-[#8B278C] via-[#B673BF] to-[#D2A0D9] 
                          lg:grid items-center hidden">
            <div className="relative flex items-center justify-center z-1">
              
              {/* ===== Common Grid Shape ===== */}
              <GridShape />

              {/* ===== Logo + Optional Text ===== */}
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/logo.jpg"
                    alt="Logo"
                    className="w-auto h-auto filter brightness-0 invert"
                    priority
                  />
                </Link>

                {/* Optional tagline */}
                <p className="text-center text-[#D4ADD9] mt-2 font-medium">
                  Your Bike Shop Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* ===== THEME TOGGLER BUTTON ===== */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>

        </div>
      </ThemeProvider>
    </div>
  );
}
