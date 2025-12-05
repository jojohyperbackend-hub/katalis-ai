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
      .insert(
        {
          doc_type: "catalog",
          title: productName,
          content: productDetails,
          style: brandStyle,
        },
        { returning: "representation" }
      );

    if (error) {
      console.error("Supabase error:", error);
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
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Buat Katalog Produk</h1>

      <div className="space-y-2">
        <label className="font-medium">Nama Produk</label>
        <input
          className="w-full p-2 border rounded-md"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Deskripsi Produk</label>
        <textarea
          className="w-full p-2 border rounded-md"
          value={productDetails}
          onChange={(e) => setProductDetails(e.target.value)}
        />
      </div>

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

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 rounded-md bg-blue-600 text-white"
      >
        Simpan ke Supabase
      </button>
    </div>
  );
}
