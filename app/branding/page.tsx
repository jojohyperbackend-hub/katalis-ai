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
  const [saving, setSaving] = useState(false);

  // ================================
  // Fetch semua data dari Supabase
  // ================================
  useEffect(() => {
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from("katal_docs")
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
  // Validasi prompt → mencegah prompt injection
  // ================================
  const isValidPrompt = (text: string) => {
    const forbiddenKeywords = [
      "hack", "exploit", "attack", "virus", "ddos",
      "password", "keylogger", "steal", "delete all",
      "malware", "sql", "injection"
    ];
    const lower = text.toLowerCase();
    return !forbiddenKeywords.some(k => lower.includes(k));
  };

  // ================================
  // Generate Branding via OpenRouter
  // ================================
  async function generateBranding() {
    if (!style || !brief) return alert("Isi style dan brief dulu");

    // Cek prompt injection
    if (!isValidPrompt(style + " " + brief)) {
      alert("Hey, yang bener aja. Hanya untuk branding!");
      return;
    }

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
            { role: "system", content: "Kamu adalah AI branding generator profesional. Output harus rapi, modern, elegan, tanpa simbol *, #, ---." },
            { role: "user", content: `Gaya: ${style}\nBrief: ${brief}` },
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
  // Klik riwayat → isi form otomatis
  // ================================
  function handleHistoryClick(doc: any) {
    setStyle(doc.style || "");
    setBrief(doc.content || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ================================
  // Save ke tabel Supabase lain (manual)
  // ================================
  async function saveOutput() {
    if (!output) return alert("Belum ada output untuk disimpan");
    setSaving(true);

    try {
      const { error } = await supabase.from("branding_results").insert([
        {
          style,
          brief,
          result: output,
          created_at: new Date(),
        },
      ]);

      if (error) {
        alert("Gagal menyimpan: " + error.message);
      } else {
        alert("Berhasil menyimpan ya yatta");
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
        .from("katal_docs")
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
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Branding Generator</h1>

      {/* FORM INPUT */}
      <div className="space-y-4">
        <input
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Gaya Brand (Modern, Elegan, Luxury...)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />

        <textarea
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Deskripsi / Brief Brand"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={generateBranding}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Generate Branding
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
        <div className="mt-6 flex flex-col gap-2">
          {renderOutput(output)}
        </div>
      )}

      {/* RIWAYAT */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Riwayat Dasar Branding</h2>
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
                  <p className="font-bold">{doc.title || "Tanpa Judul"}</p>
                  <p className="text-sm text-gray-500">{doc.doc_type}</p>
                  <p className="mt-2 whitespace-pre-wrap">{doc.content}</p>
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
