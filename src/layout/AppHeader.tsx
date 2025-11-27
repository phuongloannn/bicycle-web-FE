"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-gradient-to-r from-[#F2D8EE] to-[#D4ADD9] border-[#D2A0D9] z-99999 lg:border-b shadow-sm">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        {/* LEFT SECTION */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-[#D2A0D9] sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          {/* SIDEBAR TOGGLE */}
          <button
            className="items-center justify-center w-10 h-10 text-[#8B278C] border-[#D2A0D9] rounded-lg z-99999 lg:flex lg:h-11 lg:w-11 lg:border bg-white hover:bg-[#F2D8EE] transition-colors duration-200 shadow-sm"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" fill="currentColor" className="text-[#8B278C]">
                <path d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065..." />
              </svg>
            ) : (
              <svg width="16" height="12" fill="currentColor" className="text-[#8B278C]">
                <path d="M0.583252 1C0.583252 0.585788..." />
              </svg>
            )}
          </button>

          {/* MOBILE LOGO */}
          <Link href="/" className="lg:hidden">
            <Image width={154} height={32} src="/images/logo/logo.jpg" alt="Logo" />
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-[#8B278C] rounded-lg z-99999 hover:bg-[#F2D8EE] lg:hidden bg-white border border-[#D2A0D9] transition-colors duration-200"
          >
            <svg width="24" height="24" fill="currentColor">
              <path d="M5.99902 10.4951C6.82745 10.4951..." />
            </svg>
          </button>

          {/* SEARCH BAR (DESKTOP) */}
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B278C]">
                  🔍
                </span>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-[#D2A0D9] bg-white py-2.5 pl-12 pr-14 text-sm text-[#8B278C] shadow-sm placeholder:text-[#B673BF] focus:border-[#8B278C] focus:ring-2 focus:ring-[#F2D8EE] transition-colors duration-200"
                />

                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border bg-[#F2D8EE] px-[7px] py-[4.5px] text-xs text-[#8B278C] font-medium hover:bg-[#D2A0D9] transition-colors duration-200">
                  ⌘ K
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
        >
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>

          <UserDropdown />
        </div>

      </div>
    </header>
  );
};

export default AppHeader;