"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScroll = (id: string) => {
    // Jika masih di home → scroll langsung
    if (pathname === "/") {
      smoothScroll(id);
      return;
    }

    // Jika di halaman lain → redirect langsung tanpa nambah script
    // Gunakan anchor agar browser auto-scroll NATURAL & SUPER FAST
    router.push(`/#${id}`);
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between shadow-sm bg-white fixed top-0 z-50">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        KatalisAi
      </h1>

      <nav className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => handleScroll("hero")}
          className="hover:text-blue-600"
        >
         Hero
        </button>

        <button
          onClick={() => handleScroll("description")}
          className="hover:text-blue-600"
        >
          my fitur
        </button>

        <button
          onClick={() => handleScroll("contributors")}
          className="hover:text-blue-600"
        >
          Contributors
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Dashboard
        </button>
      </nav>
    </header>
  );
}
