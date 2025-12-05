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

        console.log("DATA SUPABASE:", data);
        setHistory(data || []);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  // ===============================
  // Generate branding Gemini API
  // ===============================
  async function generateBranding() {
    if (!brief) return alert("Isi brief dulu");

    setOutput("Loading...");

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Buat branding lengkap untuk UMKM.\nStyle: ${style}\nBrief: ${brief}\nSertakan: voice, tone, tagline, CTA, warna, persona, style visual.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        setOutput(`Error Gemini API: ${errText}`);
        return;
      }

      const data = await res.json();
      const text = data?.results?.[0]?.content?.[0]?.text || "Tidak ada output.";
      setOutput(text);
    } catch (err) {
      console.error(err);
      setOutput("Error saat generate branding.");
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Branding Generator</h1>

      {/* FORM INPUT */}
      <div className="space-y-4">
        <input
          className="border p-3 w-full rounded-xl"
          placeholder="Gaya Brand (Modern, Elegan...)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />
        <textarea
          className="border p-3 w-full rounded-xl"
          placeholder="Deskripsi / Brief Brand"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        <button
          onClick={generateBranding}
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          Generate Branding
        </button>
      </div>

      {/* OUTPUT */}
      {output && (
        <div className="border p-4 rounded-lg bg-gray-50 whitespace-pre-wrap">
          {output}
        </div>
      )}

      {/* RIWAYAT BRANDING */}
      <div>
        <h2 className="text-2xl font-semibold mt-6">Riwayat Dasar Branding (Supabase)</h2>
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {history.map((doc) => (
              <div
                key={doc.id}
                className="border p-4 rounded-lg bg-white cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setStyle(doc.style || "");
                  setBrief(doc.content || "");
                  setOutput(""); // reset output
                }}
              >
                <p className="font-bold">{doc.title || "Tanpa Judul"}</p>
                <p className="text-sm text-gray-500">{doc.style}</p>
                <p className="mt-2 whitespace-pre-wrap">{doc.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
