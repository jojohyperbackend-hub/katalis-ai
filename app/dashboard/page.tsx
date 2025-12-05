"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import firebaseConfig from "@/lib/firebase";

// INIT FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Watch auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Google Login
  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.log(err);
    }
  };

  // Anonymous Login
  const loginAnon = async () => {
    await signInAnonymously(auth);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // ============================================================
  //  LOGIN SCREEN (GOOGLE + ANONYMOUS ONLY)
  // ============================================================
  if (!user) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-6 py-16">

        {/* CARD */}
        <div className="bg-white shadow-xl border rounded-3xl p-10 w-full max-w-md text-center space-y-10 backdrop-blur-sm">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed">
            Masuk untuk melanjutkan ke dashboard & mengelola katalog kamu
          </p>

          {/* BUTTONS */}
          <div className="space-y-4 w-full">

            {/* GOOGLE LOGIN */}
            <button
              onClick={loginGoogle}
              className="w-full py-3 rounded-xl bg-black text-white font-medium tracking-wide text-sm flex items-center justify-center gap-3 hover:bg-gray-900 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              Login dengan Google
            </button>

            {/* ANONYMOUS LOGIN */}
            <button
              onClick={loginAnon}
              className="w-full py-3 rounded-xl border text-gray-700 font-medium tracking-wide text-sm hover:bg-gray-100 transition"
            >
              Login Anonymous
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Powered by Firebase Authentication
        </p>
      </main>
    );
  }

  // ============================================================
  //  DASHBOARD (SETELAH LOGIN)
  // ============================================================
  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center px-6 py-16">
      {/* HEADER + PROFILE */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

        <div className="flex items-center gap-4">

          <div className="text-right">
            <p className="font-medium">
              {user.displayName || "Anonymous User"}
            </p>
            <p className="text-xs text-gray-500">
              {user.providerData[0]?.providerId}
            </p>
          </div>

          {/* Avatar */}
          <img
            src={user.photoURL || "https://ui-avatars.com/api/?name=Anon"}
            className="w-10 h-10 rounded-full border"
          />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs"
          >
            Logout
          </button>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
          >
            Home
          </Link>
        </div>
      </div>

      {/* GRID MENU */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/catalog"
          className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition group"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
            Catalog
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Kelola, lihat, dan buat item katalog baru dengan cepat.
          </p>
        </Link>

        <Link
          href="/branding"
          className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition group"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
            Branding
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Atur aset brand, warna, logo, dan elemen visual lainnya.
          </p>
        </Link>

        <Link
          href="/pricing"
          className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition group"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
            Pricing
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Buat struktur harga dan kelola paket pricing.
          </p>
        </Link>

        <Link
          href="/export"
          className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition group"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
            Export Catalog
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Export katalog ke format PDF, JSON, atau integrasi API.
          </p>
        </Link>
      </section>
    </main>
  );
}
