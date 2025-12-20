export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            Endüstriyel Stoklarınızı Nakit Paraya Dönüştürün
          </h1>
          <p className="mb-8 text-lg text-slate-300 md:text-xl">
            Kullanılmayan otomasyon ekipmanlarınızı, yedek parçalarınızı ve ölü stoklarınızı 
            diğer şirketlere satın. Güvenli, hızlı ve profesyonel B2B pazar yeri.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-orange-600 px-8 py-3 font-semibold transition-colors hover:bg-orange-700">
              Ürünlerimizi Keşfet
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-colors hover:bg-white hover:text-slate-900">
              Nasıl Çalışır?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

