import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { forwardToModel } from "@/security/proxy"; // ✔ AI Proxy
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// -----------------------------
// 1. IP Whitelist / Anti Abuse
// -----------------------------
const allowedIPs = [
  "127.0.0.1", // Local dev
  "::1",
];

// -----------------------------
// 2. Rate limit super simple
// -----------------------------
const RATE_LIMIT_MAX = 20; // 20 request / 1 menit
const rateMap = new Map<string, { count: number; ts: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000;

  if (!rateMap.has(ip)) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }

  const data = rateMap.get(ip)!;
  if (now - data.ts > windowMs) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }

  if (data.count >= RATE_LIMIT_MAX) return false;

  data.count++;
  return true;
}

// -----------------------------
// 3. CORS super aman
// -----------------------------
export const dynamic = "force-dynamic";

function cors() {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://yourdomain.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// -----------------------------
//        MAIN HANDLERS
// -----------------------------

// GET → ambil catalog + branding + pricing
export async function GET(req: NextRequest) {
  const ip = req.ip ?? "0.0.0.0";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const [catalog, branding, pricing] = await Promise.all([
    supabase.from("catalog").select("*"),
    supabase.from("branding").select("*"),
    supabase.from("pricing").select("*"),
  ]);

  return NextResponse.json(
    {
      catalog: catalog.data || [],
      branding: branding.data || [],
      pricing: pricing.data || [],
    },
    { headers: cors() }
  );
}

// POST → forward ke AI model via proxy
export async function POST(req: NextRequest) {
  const ip = req.ip ?? "0.0.0.0";

  // 1. IP Restriction
  if (!allowedIPs.includes(ip)) {
    return NextResponse.json({ error: "Access Denied (IP not allowed)" }, { status: 403 });
  }

  // 2. Rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // 3. Parse body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 4. Forward ke OpenRouter via proxy aman
  try {
    const response = await forwardToModel(body.prompt, body.options || {});

    return NextResponse.json(
      {
        id: crypto.randomUUID(),
        ipHash: crypto.createHash("sha256").update(ip).digest("hex"), // ✔ IP tidak bocor
        ai: response,
      },
      { headers: cors() }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "AI Proxy Error (Safe Mode)",
        info: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

// OPTIONS → CORS preflight
export function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}
