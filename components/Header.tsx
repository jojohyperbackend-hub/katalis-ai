"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScroll = (id: string) => {
    if (pathname === "/") {
      smoothScroll(id);
      setOpen(false);
      return;
    }
    router.push(`/#${id}`);
    setOpen(false);
  };

  return (
    <header className="w-full bg-white fixed top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <h1
          className="text-lg sm:text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          KatalisAi
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleScroll("hero")}
            className="text-sm sm:text-base hover:text-blue-600"
          >
            Hero
          </button>
          <button
            onClick={() => handleScroll("description")}
            className="text-sm sm:text-base hover:text-blue-600"
          >
            My Fitur
          </button>
          <button
            onClick={() => handleScroll("contributors")}
            className="text-sm sm:text-base hover:text-blue-600"
          >
            Contributors
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded text-sm sm:text-base hover:bg-blue-700 transition"
          >
            Dashboard
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-800 focus:outline-none"
          >
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200 animate-slide-down">
          <div className="flex flex-col gap-2 px-4 py-4">
            <button
              onClick={() => handleScroll("hero")}
              className="text-base hover:text-blue-600 text-left w-full"
            >
              Hero
            </button>
            <button
              onClick={() => handleScroll("description")}
              className="text-base hover:text-blue-600 text-left w-full"
            >
              My Fitur
            </button>
            <button
              onClick={() => handleScroll("contributors")}
              className="text-base hover:text-blue-600 text-left w-full"
            >
              Contributors
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-3 py-2 bg-blue-600 text-white rounded text-base hover:bg-blue-700 transition w-full text-center"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
