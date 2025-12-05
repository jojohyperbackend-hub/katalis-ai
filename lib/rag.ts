import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// =========================
// OpenRouter Client
// =========================
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// =========================
// Supabase Client
// =========================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =========================
// MODEL FIX SESUAI PROJECT
// =========================

// Chat Model (yang lo pakai)
const CHAT_MODEL = "openai/gpt-5.1";

// Embedding Model (paling kompatibel)
const EMBED_MODEL = "openai/text-embedding-3-large";

// =========================
// Generate Embedding
// =========================
export async function generateEmbedding(text: string) {
  const cleaned = text.replace(/\n+/g, " ").trim();

  const embed = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: cleaned,
  });

  return embed.data[0].embedding;
}

// =========================
// Insert Document ke Vector DB
// =========================
export async function insertRAG({
  table,
  content,
  metadata = {},
}: {
  table: string;
  content: string;
  metadata?: Record<string, any>;
}) {
  const embedding = await generateEmbedding(content);

  return await supabase.from(table).insert({
    content,
    metadata,
    embedding,
  });
}

// =========================
// Hybrid Vector Search v4
// =========================
export async function ragSearch({
  table,
  query,
  matchCount = 5,
}: {
  table: string;
  query: string;
  matchCount?: number;
}) {
  // 1. Buat embedding dari query
  const embedding = await generateEmbedding(query);

  // 2. Vector search (PgVector RPC)
  const { data: vectorMatches } = await supabase.rpc("vector_search", {
    query_embedding: embedding,
    match_count: matchCount,
    table_name: table,
  });

  // 3. Keyword Search fallback
  const { data: keywordMatches } = await supabase
    .from(table)
    .select("*")
    .textSearch("content", query);

  // =========================
  // Merge + Normalize Score
  // =========================

  const merged = [
    ...(vectorMatches || []).map((v: any) => ({
      ...v,
      score: (v.similarity || 0) * 0.75,
    })),
    ...(keywordMatches || []).map((k: any) => ({
      ...k,
      score: (k.rank || 0) * 0.25,
    })),
  ];

  const unique = new Map<string, any>();

  merged.forEach((item: any) => {
    if (!unique.has(item.id)) unique.set(item.id, item);
  });

  const ranked = [...unique.values()].sort((a, b) => b.score - a.score);

  return ranked.slice(0, matchCount);
}

// =========================
// RAG Full Pipeline
// =========================
export async function ragAnswer({
  table,
  query,
  systemPrompt = "You are Katalis RAG Engine. Use context ONLY.",
}: {
  table: string;
  query: string;
  systemPrompt?: string;
}) {
  // 1. Ambil dokumen
  const docs = await ragSearch({ table, query });

  const context = docs.map((d) => d.content).join("\n---\n");

  // 2. Chat completion dengan model FIX: openai/gpt-5.1
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${query}`,
      },
    ],
  });

  return {
    answer: completion.choices[0].message.content,
    context: docs,
  };
}
