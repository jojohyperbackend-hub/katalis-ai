// utils/formatter.ts

/**
 * Format teks hasil AI menjadi lebih rapi dan elegan.
 * Menghilangkan whitespace berlebih, menambahkan line break,
 * dan menormalkan bullet / numbering.
 */
export function formatAIOutput(text: string): string {
  if (!text) return "";

  let formatted = text;

  // 1. Hapus spasi berlebih di awal/akhir tiap baris
  formatted = formatted
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  // 2. Normalisasi bullet points (ubah `-` atau `*` menjadi `•`)
  formatted = formatted.replace(/^[-*]\s+/gm, "• ");

  // 3. Tambahkan line break ekstra sebelum heading atau subjudul (misal: angka atau kata diikuti `:`)
  formatted = formatted.replace(/^(\d+\..*|.*:)/gm, "\n$1");

  // 4. Hapus multiple blank lines menjadi satu
  formatted = formatted.replace(/\n{2,}/g, "\n\n");

  return formatted;
}
