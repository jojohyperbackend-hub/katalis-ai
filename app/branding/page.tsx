"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BrandingPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [style, setStyle] = useState("");
  const [brief, setBrief] = useState("");
  const [output, setOutput] = useState("");

  // ===============================
  // Fetch semua dokumen branding
  // ===============================
  useEffect(() => {
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from("katal_docs")
          .select("*")
          .eq("doc_type", "branding")
          .order("created_at", { ascending: false });

        if (error) console.log("SUPABASE ERROR:", error);

        setHistory(data || []);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  // ===============================
  // Generate branding OpenRouter AI
  // ===============================
  async function generateBranding() {
    if (!brief) return alert("Isi brief dulu");

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      alert("API Key OpenRouter (NEXT_PUBLIC_OPENROUTER_API_KEY) belum disetting di environment (.env)");
      return;
    }

    setOutput("Loading AI (GPT-4o-mini)...");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "KatalisAi",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert branding consultant for SMEs (UMKM). Respond in Bahasa Indonesia with professional formatting."
            },
            {
              role: "user",
              content: `Buat branding lengkap untuk UMKM.\nStyle: ${style}\nBrief: ${brief}\nSertakan: voice, tone, tagline, CTA, warna, persona, style visual. Format output rapi.`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("OpenRouter API Error:", errText);
        setOutput(`Error: ${res.status} ${res.statusText}.`);
        return;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || "Tidak ada output dari AI.";
      setOutput(text);
    } catch (err) {
      console.error(err);
      setOutput("Error saat generate branding.");
    }
  }

  return (
    <div className="p-8 space-y-6 mt-20">
      <h1 className="text-3xl font-bold dark:text-white">Branding Generator</h1>

      {/* FORM INPUT */}
      <div className="space-y-4">
        <input
          className="border border-gray-300 dark:border-gray-700 p-3 w-full rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          placeholder="Gaya Brand (Modern, Elegan...)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />
        <textarea
          className="border border-gray-300 dark:border-gray-700 p-3 w-full rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[100px]"
          placeholder="Deskripsi / Brief Brand"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        <button
          onClick={generateBranding}
          className="px-4 py-2 bg-black dark:bg-blue-600 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          Generate Branding
        </button>
      </div>

      {/* OUTPUT */}
      {output && (
        <div className="border dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {output}
        </div>
      )}

      {/* RIWAYAT BRANDING */}
      <div>
        <h2 className="text-2xl font-semibold mt-6 dark:text-white">Riwayat Dasar Branding</h2>
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada riwayat.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {history.map((doc) => (
              <div
                key={doc.id}
                className="border dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setStyle(doc.style || "");
                  setBrief(doc.content || "");
                  setOutput(""); // reset output
                }}
              >
                <p className="font-bold dark:text-white">{doc.title || "Tanpa Judul"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{doc.style}</p>
                <p className="mt-2 whitespace-pre-wrap dark:text-gray-300">{doc.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
