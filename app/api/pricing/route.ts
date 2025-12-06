import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { targetMarket, costPrice, notes, catalog } = await req.json();

        const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenRouter API Key not configured" },
                { status: 500 }
            );
        }

        // Construct context from catalog items if available
        let catalogContext = "";
        if (catalog && catalog.length > 0) {
            catalogContext =
                "Referensi Produk dalam Katalog:\n" +
                catalog
                    .map(
                        (c: any) =>
                            `- ${c.title || c.product_name} (${c.style}): ${c.content || c.product_details}`
                    )
                    .join("\n");
        }

        const prompt = `
      Saya butuh analisa harga dan strategi penjualan.
      
      Data Produk:
      - Target Market: ${targetMarket}
      - Harga Modal: Rp ${costPrice}
      - Catatan Tambahan: ${notes || "-"}
      
      ${catalogContext}
      
      Tugas:
      1. Tentukan Harga Jual Ideal (berikan angka spesifik dalam Rp).
      2. Berikan Analisa Pasar singkat (seberapa kompetitif, daya beli).
      3. Strategi Jualan yang cocok (bundling, diskon, positioning).
      
      Format Output JSON:
      {
        "idealPrice": "50.000",
        "marketAnalysis": "...",
        "salesStrategy": "..."
      }
    `;

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "KatalisAi",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert business analyst. Respond in JSON format only.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                response_format: { type: "json_object" },
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            return NextResponse.json(
                { error: `OpenRouter Error: ${errText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) {
            return NextResponse.json(
                { error: "No content from AI" },
                { status: 500 }
            );
        }

        // Parse JSON from content string
        let resultJson;
        try {
            resultJson = JSON.parse(content);
        } catch (e) {
            return NextResponse.json(
                { error: "Failed to parse AI JSON response" },
                { status: 500 }
            );
        }

        return NextResponse.json(resultJson);
    } catch (err) {
        console.error("Pricing API Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
