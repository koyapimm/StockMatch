"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: mailto kullanarak form gönderimi
    const mailto = `mailto:info@stockmatch.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `İsim: ${formData.name}\nE-posta: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">
          İletişim
        </h1>
        <p className="mb-12 text-lg text-slate-600">
          Sorularınız veya önerileriniz için bize ulaşabilirsiniz.
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* İletişim Bilgileri */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              İletişim Bilgileri
            </h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">E-posta</p>
                  <a
                    href="mailto:info@stockmatch.com"
                    className="text-slate-600 hover:text-slate-600 hover:underline"
                  >
                    info@stockmatch.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Phone className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Telefon</p>
                  <a
                    href="tel:+902121234567"
                    className="text-slate-600 hover:text-slate-600 hover:underline"
                  >
                    +90 (212) 123 45 67
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <MapPin className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Adres</p>
                  <span className="text-slate-600">
                    Karşıyaka, İzmir, Türkiye
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* İletişim Formu */}
          <div className="rounded-md bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Bize Yazın
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
                  placeholder="ornek@firma.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Konu *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
                >
                  <option value="">Seçiniz</option>
                  <option value="Genel Bilgi">Genel Bilgi</option>
                  <option value="Teknik Destek">Teknik Destek</option>
                  <option value="İş Birliği">İş Birliği</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
                  placeholder="Mesajınızı yazın..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Send className="h-4 w-4" /> Gönder
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
