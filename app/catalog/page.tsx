"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function CatalogPage() {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [brandStyle, setBrandStyle] = useState("santai");

  const handleSave = async () => {
    if (!productName || !productDetails) {
      alert("Nama dan deskripsi wajib diisi.");
      return;
    }

    const { data, error } = await supabaseBrowser
      .from("katal_docs")
      .insert({
        doc_type: "catalog",
        title: productName,
        content: productDetails,
        style: brandStyle,
      })
      .select();

    if (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan data.");
      return;
    }

    const newId = data?.[0]?.id;
    if (!newId) {
      router.push("/dashboard");
      return;
    }

    router.push(`/branding?latest=${newId}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 mt-20">
      <h1 className="text-3xl font-bold dark:text-white">Buat Katalog Produk</h1>

      <div className="space-y-2">
        <label className="font-medium dark:text-gray-200">Nama Produk</label>
        <input
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Masukkan nama produk"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium dark:text-gray-200">Deskripsi Produk</label>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors min-h-[120px]"
          value={productDetails}
          onChange={(e) => setProductDetails(e.target.value)}
          placeholder="Jelaskan produk Anda"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium dark:text-gray-200">Gaya Brand</label>
        <select
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors cursor-pointer"
          value={brandStyle}
          onChange={(e) => setBrandStyle(e.target.value)}
        >
          <option value="santai">Santai</option>
          <option value="formal">Formal</option>
          <option value="ceria">Ceria</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition-colors shadow-sm hover:shadow-md"
      >
        Simpan
      </button>
    </div>
  );
}
