"use client";

import { useEffect, useState } from "react";

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [branding, setBranding] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);

  // Fetch supabase data
  const fetchAll = async () => {
    const res = await fetch("/api/export-all");
    const json = await res.json();
    setCatalog(json.catalog);
    setBranding(json.branding);
    setPricing(json.pricing);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /**
   * =========================================================
   * EXPORT TO PNG / JPG (ANTI-TAINTED)
   * =========================================================
   */
  const exportImage = async (format: "png" | "jpg") => {
    setLoading(true);

    // Canvas ukuran besar (A4 landscape)
    const width = 1600;
    const height = 2000;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#000";
    ctx.font = "bold 32px Arial";
    ctx.fillText("KATALIS AI — EXPORT DATA", 50, 60);

    let y = 120; // posisi awal vertical

    const section = (title: string, body: any) => {
      ctx.font = "bold 26px Arial";
      ctx.fillText(title, 50, y);
      y += 40;

      ctx.font = "18px Arial";
      const text = JSON.stringify(body, null, 2);
      const lines = text.split("\n");

      lines.forEach((line) => {
        ctx.fillText(line.substring(0, 110), 60, y);
        y += 24;
      });

      y += 40; // jarak antar section
    };

    section("📦 CATALOG", catalog);
    section("🎨 BRANDING", branding);
    section("💰 PRICING", pricing);

    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const url = canvas.toDataURL(mime);

    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.${format}`;
    a.click();

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Export Data (PNG / JPG)</h1>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => exportImage("png")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Export PNG
        </button>

        <button
          onClick={() => exportImage("jpg")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Export JPG
        </button>
      </div>

      {loading && <p className="text-sm opacity-70">Menggenerate gambar…</p>}
    </div>
  );
}
