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
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        {/* LEFT SECTION */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          {/* SIDEBAR TOGGLE */}
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" fill="currentColor">
                <path d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065..." />
              </svg>
            ) : (
              <svg width="16" height="12" fill="currentColor">
                <path d="M0.583252 1C0.583252 0.585788..." />
              </svg>
            )}
          </button>

          {/* MOBILE LOGO */}
          <Link href="/" className="lg:hidden">
            <Image width={154} height={32} className="dark:hidden" src="/images/logo/Logo.png" alt="Logo" />
            <Image width={154} height={32} className="hidden dark:block" src="/images/logo/Logo.png" alt="Logo" />
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" fill="currentColor">
              <path d="M5.99902 10.4951C6.82745 10.4951..." />
            </svg>
          </button>

          {/* SEARCH BAR (DESKTOP) */}
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  🔍
                </span>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                />

                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:bg-white/10">
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
