"use server";

import { createClient } from "@supabase/supabase-js";

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// OpenRouter (GPT-5.1)
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * =========================================================
 * RAG FETCH — Ambil data katalog terbaru dari Supabase
 * =========================================================
 */
async function getCatalogRAG() {
  const { data, error } = await supabase
    .from("catalog")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * =========================================================
 * MAIN SERVER ACTION — Ultra Smart Pricing AI v3
 * =========================================================
 */
export async function generateSmartPricing({
  targetMarket,
  salesStrategy,
  competitorLevel,
}: {
  targetMarket: string;
  salesStrategy: string;
  competitorLevel: string;
}) {
  try {
    // 1. Ambil data katalog (RAG)
    const catalogData = await getCatalogRAG();

    // RAG context
    const ragContext = JSON.stringify(catalogData, null, 2);

    // 2. Panggil OpenRouter AI (GPT-5.1)
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.1",
        messages: [
          {
            role: "system",
            content: `
Anda adalah AI Ultra Smart Pricing v3.
Gunakan data katalog berikut sebagai RAG:

${ragContext}

Tugas:
- Tentukan harga optimal.
- Analisa pasar berdasarkan kompetitor.
- Berikan strategi jualan yang presisi.
- Berikan skenario harga minimum/ideal/premium.
- Output harus rapi dan terstruktur.
            `,
          },
          {
            role: "user",
            content: `
Target Market: ${targetMarket}
Sales Strategy: ${salesStrategy}
Competitor Level: ${competitorLevel}

Buat analisa harga lengkap dan final.
            `,
          },
        ],
      }),
    });

    const result = await response.json();

    const aiOutput = result?.choices?.[0]?.message?.content || "Tidak ada output.";

    return {
      success: true,
      data: aiOutput,
      rag: catalogData,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}
