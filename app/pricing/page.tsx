"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PricingPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [brief, setBrief] = useState("");
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);

  // ================================
  // Fetch semua data dari branding_results
  // ================================
  useEffect(() => {
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from("branding_results")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) console.log("SUPABASE ERROR:", error);
        setHistory(data || []);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  // ================================
  // Generate Pricing AI (RAG + Vector)
  // ================================
  async function generatePricing() {
    if (!brief) return alert("Isi strategi / brief dulu");
    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      setOutput("Error: OpenRouter API Key tidak ditemukan");
      return;
    }

    setOutput("Loading...");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Kamu adalah AI Pricing & Strategi Modal profesional dengan sistem RAG + vector database. Format output agar seperti chat bubble modern, rapi, elegant, mudah dibaca, tanpa simbol *, #, atau ---."
            },
            { role: "user", content: `Strategi / Brief: ${brief}` },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setOutput(`Error OpenRouter: ${errText}`);
        return;
      }

      const json = await res.json();
      let text = json?.choices?.[0]?.message?.content || "No output";

      // Bersihkan simbol yang tidak diinginkan
      text = text.replace(/[*#\-]{1,}/g, "").trim();

      setOutput(text);
    } catch (err: any) {
      console.log("OpenRouter API ERROR:", err);
      setOutput(`OpenRouter API ERROR: ${err.message || err}`);
    }
  }

  // ================================
  // Klik history → isi form otomatis
  // ================================
  function handleHistoryClick(doc: any) {
    setBrief(doc.result || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ================================
  // Save ke tabel pricing_results manual
  // ================================
  async function saveOutput() {
    if (!output) return alert("Belum ada output untuk disimpan");
    setSaving(true);

    try {
      const { error } = await supabase.from("pricing_results").insert([
        {
          brief,
          result: output,
          created_at: new Date(),
        },
      ]);

      if (error) {
        alert("Gagal menyimpan: " + error.message);
      } else {
        alert("Berhasil menyimpan ke pricing_results");
      }
    } catch (err: any) {
      console.log("SAVE ERROR:", err);
      alert("Error saat menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ================================
  // Delete history item
  // ================================
  async function deleteHistoryItem(id: number) {
    if (!confirm("Hapus riwayat ini?")) return;
    try {
      const { error } = await supabase
        .from("branding_results")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Gagal hapus: " + error.message);
        return;
      }

      setHistory(history.filter((item) => item.id !== id));
    } catch (err: any) {
      console.log("DELETE ERROR:", err);
      alert("Error saat hapus: " + err.message);
    }
  }

  // ================================
  // Fungsi untuk formatting output ala ChatGPT 5
  // ================================
  const renderOutput = (text: string) => {
    const lines = text.split("\n").filter(Boolean);
    return lines.map((line, idx) => (
      <div
        key={idx}
        className="self-start bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 p-4 rounded-xl rounded-tl-none max-w-full sm:max-w-xl shadow-lg whitespace-pre-wrap break-words"
      >
        {line}
      </div>
    ));
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Pricing & Strategi Modal
      </h1>

      {/* FORM INPUT */}
      <div className="space-y-4">
        <textarea
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
          placeholder="Masukkan strategi / brief pasar"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={generatePricing}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Generate Pricing
          </button>

          <button
            onClick={saveOutput}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Output"}
          </button>
        </div>
      </div>

      {/* OUTPUT AI Bubble */}
      {output && (
        <div className="mt-6 flex flex-col gap-3">
          {renderOutput(output)}
        </div>
      )}

      {/* RIWAYAT */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Riwayat Branding / Strategi Pasar</h2>
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat.</p>
        ) : (
          <div className="space-y-4">
            {history.map((doc: any) => (
              <div
                key={doc.id}
                className="border p-4 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div onClick={() => handleHistoryClick(doc)} className="flex-1">
                  <p className="font-bold">{doc.style || "Tanpa Style"}</p>
                  <p className="text-sm text-gray-500">{new Date(doc.created_at).toLocaleString()}</p>
                  <p className="mt-2 whitespace-pre-wrap">{doc.result}</p>
                </div>
                <button
                  onClick={() => deleteHistoryItem(doc.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition self-start sm:self-auto"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
