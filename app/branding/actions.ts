"use server";

import { createClient } from "@supabase/supabase-js";

// ⬇️ Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// ⬇️ Akses OpenRouter GPT-5.1
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

/**
 * Generate Branding dari katalog user
 */
export async function generateBranding(brandStyle: string) {
  try {
    // 1️⃣ Ambil daftar katalog dari Supabase
    const { data: catalog, error } = await supabase
      .from("catalog")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        status: "error",
        message: "Gagal ngambil katalog dari database",
      };
    }

    if (!catalog || catalog.length === 0) {
      return {
        status: "error",
        message: "Tidak ada katalog yang tersedia",
      };
    }

    // 2️⃣ Generate branding via GPT-5.1 (OpenRouter)
    const prompt = `
Kamu adalah Branding Assistant profesional.
Buat branding untuk perusahaan berdasarkan daftar item katalog berikut:

KATALOG:
${JSON.stringify(catalog, null, 2)}

STYLE BRANDING USER:
${brandStyle}

Buat output yang lengkap:
- Brand Identity
- Tone & Voice
- Warna Utama
- Typography
- Brand Persona
- Tagline
- Pesan Utama Marketing

Format output tetap rapih & jelas.
    `;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.1",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await aiRes.json();

    const brandingOutput =
      result?.choices?.[0]?.message?.content || "Branding gagal digenerate.";

    return {
      status: "success",
      branding: brandingOutput,
    };
  } catch (err) {
    return {
      status: "error",
      message: "Error internal server",
      detail: String(err),
    };
  }
}
