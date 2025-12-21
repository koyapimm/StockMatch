"use client";

import Modal from "./Modal";

type HowItWorksModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HowItWorksModal({
  isOpen,
  onClose,
}: HowItWorksModalProps) {
  const steps = [
    {
      number: 1,
      title: "Kayıt Ol & Doğrula",
      description: "Şirket bilgilerinizi girin ve belgelerinizi yükleyin. Vergi numarası ve MERSİS/NACE kodu ile doğrulama yapılır.",
      icon: "📋",
    },
    {
      number: 2,
      title: "Ölü Stok Listele",
      description: "Fotoğraf çekin ve 30 saniyede yükleyin. Ürün bilgilerini girin ve fiyatlandırın.",
      icon: "📸",
    },
    {
      number: 3,
      title: "Eşleşmeleri Al",
      description: "Sizin parçalarınızı arayan alıcıları size bildiriyoruz. Talep geldiğinde haberdar olursunuz.",
      icon: "🔔",
    },
    {
      number: 4,
      title: "Anlaş & Gönder",
      description: "Fiyat konusunda anlaşın ve ürünü kargoya verin. Güvenli ödeme ve teslimat sistemi.",
      icon: "🤝",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="StockMatch Nasıl Çalışır?">
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
              {step.icon}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-orange-600">
                  ADIM {step.number}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          </div>
        ))}

        <div className="mt-8 rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-700">
            <strong>Not:</strong> Tüm işlemler güvenli ve şeffaftır. Şirket
            doğrulaması yapıldıktan sonra platformu kullanmaya başlayabilirsiniz.
          </p>
        </div>
      </div>
    </Modal>
  );
}

