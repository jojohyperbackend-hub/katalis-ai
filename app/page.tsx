// page.jsx
export default function HomePage() {
  return (
    <main className="w-full flex flex-col gap-32 pt-28 dark:bg-gray-950">

      {/* ===================================== */}
      {/* HERO SECTION */}
      {/* ===================================== */}
      <section
        id="hero"
        className="px-6 max-w-5xl mx-auto text-center flex flex-col items-center gap-8"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          KatalisAi
          <span className="text-blue-600 dark:text-blue-400">.</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Solusi AI tercepat untuk UMKM membuat katalog produk profesional<br />
          <span className="font-semibold text-gray-800 dark:text-gray-200">tanpa ribet Langsung sat set.</span>
        </p>

        <div className="flex gap-4 mt-4">
          <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-md transition-colors">
            Mulai Sekarang
          </button>

          <button className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-lg transition-colors">
            Lihat Demo
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Gratis untuk UMKM kecil
        </p>
      </section>

      {/* ===================================== */}
      {/* DESCRIPTION */}
      {/* ===================================== */}
      <section
        id="description"
        className="px-6 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
          Fitur Utama KatalisAi
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Text-to-Catalog</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Input teks → langsung jadi katalog lengkap: judul, deskripsi, USP,
              kategori, harga, dan tone brand.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Branding Assistant</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              AI otomatis membuat tema warna, tone of voice, dan style katalog
              tanpa chatbot.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Smart Pricing AI</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Rekomendasi harga berdasarkan data pasar UMKM Indonesia.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Export Multi Format</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Export langsung ke PDF profesional atau IG Carousel 11 slide.
            </p>
          </div>

        </div>
      </section>

      {/* ===================================== */}
      {/* CONTRIBUTORS */}
      {/* ===================================== */}
      <section
        id="contributors"
        className="px-6 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
          Contributors & Team
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* MEMBER 1 */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://avatars.githubusercontent.com/u/241575995?v=4"
              className="w-28 h-28 rounded-full object-cover bg-gray-200 shadow"
            />
            <h3 className="text-lg font-semibold dark:text-white">Jojo Hyper</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Leader • Fullstack Dev • Brainstorming</p>
          </div>

          {/* MEMBER 2 */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://avatars.githubusercontent.com/u/183807013?v=4"
              className="w-28 h-28 rounded-full object-cover bg-gray-200 shadow"
            />
            <h3 className="text-lg font-semibold dark:text-white">Zee (Jojo smurfing)</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Brainstorming • UI/UX Designer</p>
          </div>

          {/* MEMBER 3 */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://avatars.githubusercontent.com/u/82357480?v=4"
              className="w-28 h-28 rounded-full object-cover bg-gray-200 shadow"
            />
            <h3 className="text-lg font-semibold dark:text-white">RiddSanz (Parid)</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Brainstorming • Quality Control</p>
          </div>

        </div>
      </section>

    </main>
  );
}
