"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "retro";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (mode: Theme) => {
    document.documentElement.classList.remove("light", "dark", "retro");
    document.documentElement.classList.add(mode);
  };

  const toggleTheme = () => {
    let nextTheme: Theme;
    if (theme === "light") nextTheme = "dark";
    else if (theme === "dark") nextTheme = "retro";
    else nextTheme = "light";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      smoothScroll(id);
      return;
    }
    router.push(`/#${id}`);
  };

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Theme icon based on current theme
  const renderThemeIcon = () => {
    if (theme === "light") return "☀️";
    if (theme === "dark") return "🌙";
    if (theme === "retro") return "🕹️";
  };

  return (
    <>
      <header className="w-full py-4 px-6 flex items-center justify-between shadow-sm fixed top-0 z-50 transition-colors">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          KatalisAi
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => handleScroll("hero")}>Hero</button>
          <button onClick={() => handleScroll("description")}>Features</button>
          <button onClick={() => handleScroll("contributors")}>Contributors</button>
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>

          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Toggle theme"
          >
            {renderThemeIcon()}
          </button>
        </nav>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {renderThemeIcon()}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✖️" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col p-6 space-y-6 mt-16">
          <button onClick={() => handleScroll("hero")}>Hero</button>
          <button onClick={() => handleScroll("description")}>Features</button>
          <button onClick={() => handleScroll("contributors")}>Contributors</button>
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
