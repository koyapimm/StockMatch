import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Eye, Shield, Zap, Users, ArrowRight } from "lucide-react";

export default function KurumsalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">
          Kurumsal
        </h1>
        <p className="mb-12 text-lg text-slate-600">
          StockMatch, endüstriyel otomasyon sektöründe atıl stokların ekonomiye kazandırılması için kurulmuş, güvenli B2B pazar yeridir.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 sm:text-2xl">
              <Target className="h-6 w-6 text-slate-700" />
              Misyonumuz
            </h2>
            <p className="text-slate-700">
              Depolarda bekleyen endüstriyel ekipmanları, ihtiyacı olan firmalarla buluşturarak hem atıl varlıkların değere dönüşmesini hem de sektörde sürdürülebilir bir kaynak dolaşımı sağlamak.
            </p>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 sm:text-2xl">
              <Eye className="h-6 w-6 text-slate-700" />
              Vizyonumuz
            </h2>
            <p className="text-slate-700">
              Türkiye&apos;nin endüstriyel atıl stok konusunda referans B2B platformu olmak; güvenli, şeffaf ve verimli bir pazar yeri sunmak.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-xl font-semibold text-slate-900 sm:text-2xl">
              Neden StockMatch?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-md bg-white p-6 shadow-sm">
                <Shield className="mb-3 h-8 w-8 text-slate-700" />
                <h3 className="mb-2 font-semibold text-slate-900">Güvenli İşlem</h3>
                <p className="text-sm text-slate-600">
                  Firmalar doğrulanır, NDA kabul edilmeden iletişim bilgilerine erişim sağlanmaz.
                </p>
              </div>
              <div className="rounded-md bg-white p-6 shadow-sm">
                <Zap className="mb-3 h-8 w-8 text-slate-700" />
                <h3 className="mb-2 font-semibold text-slate-900">Hızlı Eşleştirme</h3>
                <p className="text-sm text-slate-600">
                  İhtiyaç ve arz hızlıca eşleşir, süreçler basitleştirilmiştir.
                </p>
              </div>
              <div className="rounded-md bg-white p-6 shadow-sm">
                <Users className="mb-3 h-8 w-8 text-slate-700" />
                <h3 className="mb-2 font-semibold text-slate-900">Sadece B2B</h3>
                <p className="text-sm text-slate-600">
                  Yalnızca tüzel kişilikler kullanabilir; profesyonel iş ortamı sunulur.
                </p>
              </div>
              <div className="rounded-md bg-white p-6 shadow-sm">
                <Target className="mb-3 h-8 w-8 text-slate-700" />
                <h3 className="mb-2 font-semibold text-slate-900">Sektöre Özel</h3>
                <p className="text-sm text-slate-600">
                  Endüstriyel otomasyon odaklı; PLC, motor, sürücü, sensör vb. kategoriler.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Ürünlere Göz At <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Bize Ulaşın
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
