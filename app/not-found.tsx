import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-7xl font-bold text-slate-200 sm:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Sayfa Bulunamadı
          </h1>
          <p className="mt-2 max-w-md text-slate-600">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Home className="h-5 w-5" />
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Search className="h-5 w-5" />
              Ürünlere Göz At
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
