"use server";

import { supabase } from "@/lib/supabase";
import { ragQuery } from "@/lib/rag";

// Server Action: Ambil data katalog user
export async function getCatalogByUser(userId: string) {
  const { data, error } = await supabase
    .from("catalogs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data;
}

// Server Action: Generate katalog via OpenRouter (GPT-5.1)
export async function generateCatalog(payload: {
  product_name: string;
  product_details: string;
  brand_style: string;
}) {
  const prompt = `Buatkan katalog produk UMKM:
  Nama: ${payload.product_name}
  Detail: ${payload.product_details}
  Style: ${payload.brand_style}

  Output dalam format:
  - Judul
  - Deskripsi marketing
  - Keunggulan
  - Kategori produk
  - Range harga
  - USP
  - Tone sesuai style
  `;

  const req = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.APP_URL || "localhost",
      "X-Title": "KatalisAI",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.1",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const res = await req.json();
  return res.choices?.[0]?.message?.content || "";
}
