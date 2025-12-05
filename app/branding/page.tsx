"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BrandingPage() {
  const searchParams = useSearchParams();
  const latestId = searchParams.get("latest");

  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [style, setStyle] = useState("");
  const [brief, setBrief] = useState("");

  // Ambil 1 data katalog berdasarkan ?latest=
  const fetchCatalog = async () => {
    try {
      if (!latestId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/catalog?id=${latestId}`); 
      const data = await res.json();

      // data bisa array atau object → normalisasi ke array
      setCatalogItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.log("Error fetching catalog:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, [latestId]);

  // Trigger AI branding generator
  const generateBranding = async () => {
    if (!style || !brief) {
      alert("Isi semua bidang terlebih dahulu");
      return;
    }

    try {
      const res = await fetch("/api/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style,
          brief,
          catalog: catalogItems,
        }),
      });

      const result = await res.json();
      console.log("BRANDING RESULT:", result);

      // TODO: tampilkan hasilnya
    } catch (e) {
      console.log("Error generate branding:", e);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-4xl">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Branding Assistant</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>
        </div>

        {/* BRANDING FORM */}
        <section className="p-6 bg-white rounded-2xl shadow-sm border mb-12 space-y-6">
          <h2 className="text-xl font-semibold">Generate Branding Dengan AI</h2>

          {/* STYLE INPUT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Gaya Branding Yang Diinginkan
            </label>
            <input
              placeholder="Contoh: Minimalis, Futuristik, Elegant, Retro, dsb..."
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* BRIEF INPUT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Deskripsi Singkat (Brief)
            </label>
            <textarea
              placeholder="Tulis deskripsi brand kamu..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={5}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generateBranding}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium tracking-wide hover:bg-blue-700 transition"
          >
            Generate Branding
          </button>
        </section>

        {/* CATALOG SECTION */}
        <section className="p-6 bg-white rounded-2xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">
            Data Katalog (Sebagai Referensi Branding)
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading katalog…</p>
          ) : (
            <div className="space-y-3">
              {catalogItems.length < 1 && (
                <p className="text-gray-400 text-sm">Tidak ada data katalog.</p>
              )}

              {catalogItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-xl bg-gray-50"
                >
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">{item.product_details}</p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
