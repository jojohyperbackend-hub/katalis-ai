"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [targetMarket, setTargetMarket] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [notes, setNotes] = useState("");

  const [result, setResult] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Ambil data dari katalog (tanpa dummy)
  const fetchCatalog = async () => {
    try {
      const res = await fetch("/api/catalog");
      const data = await res.json();
      setCatalogItems(data || []);
    } catch (err) {
      console.log("Error fetching catalog:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Generate harga dari AI
  const generatePricing = async () => {
    if (!targetMarket || !costPrice) {
      alert("Isi semua bidang penting terlebih dahulu.");
      return;
    }

    setLoadingAI(true);

    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetMarket,
          costPrice,
          notes,
          catalog: catalogItems,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.log("AI Error:", err);
    }

    setLoadingAI(false);
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-6 py-20 flex flex-col items-center transition-colors">
      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight dark:text-white">Pricing Assistant</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>
        </div>

        {/* FORM SECTION */}
        <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 mb-12 space-y-6 transition-colors">
          <h2 className="text-xl font-semibold dark:text-white">AI Penentu Harga & Analisa Pasar</h2>

          {/* TARGET MARKET */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Target Market
            </label>
            <input
              placeholder="Contoh: Remaja, Profesional, UMKM, Kolektor, dsb..."
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          {/* COST PRICE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Harga Modal (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 55000"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          {/* CATATAN TAMBAHAN */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Catatan (opsional)
            </label>
            <textarea
              placeholder="Contoh: Fast moving, pasar sedang naik, kompetitor banyak..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            ></textarea>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generatePricing}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium tracking-wide hover:bg-blue-700 transition"
          >
            {loadingAI ? "Menghitung harga..." : "Generate Harga"}
          </button>
        </section>

        {/* HASIL AI */}
        {result && (
          <section className="p-6 mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 space-y-4 transition-colors">
            <h2 className="text-xl font-semibold dark:text-white">Rekomendasi Harga & Strategi</h2>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 space-y-3">
              <p className="font-medium dark:text-gray-200">Harga Jual Ideal:</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                Rp {result?.idealPrice}
              </p>

              <hr className="dark:border-gray-700" />

              <p className="font-medium dark:text-gray-200">Analisa Pasar:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {result?.marketAnalysis}
              </p>

              <hr className="dark:border-gray-700" />

              <p className="font-medium dark:text-gray-200">Strategi Jualan:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {result?.salesStrategy}
              </p>
            </div>
          </section>
        )}

        {/* CATALOG DATA */}
        <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 transition-colors">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Data Katalog (Referensi Produk)
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading katalog…</p>
          ) : (
            <div className="space-y-3">
              {catalogItems.length < 1 && (
                <p className="text-gray-400 dark:text-gray-500 text-sm">Tidak ada data katalog.</p>
              )}

              {catalogItems.map((item, idx) => (
                <div key={idx} className="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 transition-colors">
                  <p className="font-medium dark:text-white">{item.product_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.product_details}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Style: {item.brand_style}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
