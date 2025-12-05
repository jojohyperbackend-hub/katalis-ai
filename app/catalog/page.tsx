"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function CatalogPage() {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [brandStyle, setBrandStyle] = useState("santai");

  // Save to Supabase (terhubung ke branding)
  const handleSave = async () => {
    const { data, error } = await supabaseBrowser
      .from("catalogs")
      .insert(
        {
          product_name: productName,
          product_details: productDetails,
          brand_style: brandStyle,
          created_at: new Date(),
        },
        { returning: "representation" } // penting supaya dapet ID
      );

    if (error) {
      console.error("Supabase error:", error);
      alert("Gagal menyimpan data.");
      return;
    }

    const newId = data?.[0]?.id;

    if (!newId) {
      alert("Data tersimpan, tapi ID tidak ditemukan.");
      router.push("/dashboard");
      return;
    }

    // ➜ langsung ke branding dengan ID katalog terbaru
    router.push(`/branding?latest=${newId}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Buat Katalog Produk</h1>

        {/* Nama Produk */}
        <div className="space-y-2">
          <label className="font-medium">Nama Produk</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/* Deskripsi Produk */}
        <div className="space-y-2">
          <label className="font-medium">Detail / Deskripsi Produk</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
          />
        </div>

        {/* Gaya Brand */}
        <div className="space-y-2">
          <label className="font-medium">Gaya Brand</label>
          <select
            className="w-full p-2 border rounded-md"
            value={brandStyle}
            onChange={(e) => setBrandStyle(e.target.value)}
          >
            <option value="santai">Santai</option>
            <option value="formal">Formal</option>
            <option value="ceria">Ceria</option>
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Simpan ke Supabase
        </button>
      </div>
    </div>
  );
}
