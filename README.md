# Katalis ai

## 🎯 Deskripsi Proyek
Proyek ini dibuat oleh tim **CAT Lovers** untuk hackathon tahun ini. Aplikasi ini berfokus pada **Katalis ai** berbasis web apikasi yang berfungsi untuk membuat branding dan simpan katalog lalu di beranding lewat Generate ai

Fitur utama:
- Simpan katalog produk di Supabase
- Riwayat branding tersimpan di Supabase
- Generate branding AI menggunakan Gemini API
- Menampilkan riwayat branding terbaru
- Interface sederhana dan responsif

> ⚠️ Catatan: Karena keterbatasan API, jika quota Gemini habis, AI generate mungkin tidak berjalan.

---

## 📥 Cara Git Clone dan Setup

1. Pastikan sudah menginstall Git dan Node.js (v20+ disarankan).

2. Clone repository:
```bash
git clone https://github.com/jojohyperbackend-hub/katalis-ai.git
cd katalis-ai
```

3. Install dependencies:
```bash
npm install
```
atau
```bash
yarn install
```

4. Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENROUTER_API_KEY=Open_router_key
```

5. Jalankan project di mode development:
```bash
npm run dev
```
atau
```bash
yarn dev
```

6. Buka browser di `http://localhost:3000` untuk melihat aplikasi.

---

## 📂 Struktur Folder
```
app/
 ├─ branding/
 │   ├─ page.tsx           # Halaman utama Branding AI
 │   └─ actions.ts         # (Opsional, jika server action)
 ├─ catalog/
 │   └─ page.tsx           # Halaman buat katalog produk
 lib/
 ├─ supabase-client.ts    # Client Supabase
.env.local                 # Konfigurasi environment variable
package.json               # Dependency project
```

---

## ⚡ Cara Menggunakan

1. **Tambahkan Katalog Produk:** Masuk ke halaman katalog, isi nama produk, detail, dan gaya brand.
2. **Generate Branding AI:** Pilih data katalog, isi gaya brand dan brief, klik tombol `Generate Branding`.
3. **Lihat Riwayat:** Semua branding yang di-generate akan muncul di bawah, dari Supabase.

---

## 💡 Catatan Tim
- Saat hackathon, tim mengalami beberapa masalah teknis, terutama API quota dan sinkronisasi data.
- Jika tidak sempat menyelesaikan semua fitur, **CAT Lovers berencana kembali tahun depan** untuk ikut hackathon lagi.

---

## 📌 Lisensi
Proyek ini open-source, lisensi MIT.

---

## kontributor
-Jojo hyperland(foxy) => Leader, Fullstack Dev, Brainstroming

-Glen => brainstroming

-Farid => Brainstorming, Quality Control dan sepuh scroll fesnuk

Terima kasih sudah melihat proyek kami. Semoga tahun depan CAT Lovers bisa berkontribusi lebih maksimal di hackathon berikutnya!

