"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const contributors = [
    {
      name: "Mr.foxy (jong)",
      role: "Leader • Fullstack Dev • Brainstorming",
      symbol: "🦊"
    },
    {
<<<<<<< HEAD
      name: "farid",
      role: "Brainstorming • Quality Control",
=======
      name: "RiddSanz (Parid)",
      role: "Brainstorming • Quality Control • UI/UX",
>>>>>>> ea5f079206a77f30bdf09e439832a88e0bd1b6c2
      symbol: "👨‍💻"
    },
    {
      name: "Glenn",
      role: "Brainstorming • Rancangan Awal",
      symbol: "🧠"
    }
  ];

  return (
    <main className="w-full flex flex-col gap-32 pt-28">

      {/* HERO SECTION */}
      <section
        id="hero"
        className="px-6 sm:px-8 md:px-12 max-w-5xl mx-auto text-center flex flex-col items-center gap-8"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          KatalisAi<span className="text-blue-600">.</span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
          Solusi AI tercepat untuk UMKM membuat katalog produk profesional
          <span className="font-semibold text-gray-800"> tanpa ribet, langsung sat set.</span>
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-md"
        >
          Try Now
        </button>

        <p className="text-sm text-gray-500 mt-2">Gratis untuk UMKM kecil</p>
      </section>

      {/* DESCRIPTION */}
      <section
        id="description"
        className="px-6 sm:px-8 md:px-12 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
          Fitur Utama KatalisAi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {[
            {
              title: "AI Text-to-Catalog",
              desc: "Input teks → langsung jadi katalog lengkap: nama brand, deskripsi moto, nilai-nilai dan target pasar"
            },
            {
              title: "AI Branding Assistant",
              desc: "AI otomatis membuat sebuah branding sesuai style penjualan"
            },
            {
              title: "Smart Pricing AI",
              desc: "Rekomendasi harga berdasarkan data pasar UMKM Indonesia dan racangan awal"
            },
            {
              title: "Comming soon",
              desc: "Next fitur so Cooming soon"
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTRIBUTORS */}
      <section
        id="contributors"
        className="px-6 sm:px-8 md:px-12 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
          Contributors & Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {contributors.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-blue-600 flex items-center justify-center text-5xl shadow-md bg-white">
                {member.symbol}
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600 text-sm text-center">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
