import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const [catalog, branding, pricing] = await Promise.all([
    supabase.from("catalog").select("*"),
    supabase.from("branding").select("*"),
    supabase.from("pricing").select("*"),
  ]);

  return NextResponse.json({
    catalog: catalog.data || [],
    branding: branding.data || [],
    pricing: pricing.data || [],
  });
}
