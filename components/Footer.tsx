"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/stockmatch_logo.jpeg"
                alt="StockMatch"
                width={160}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mb-4 text-sm text-slate-400">
              Endüstriyel ölü stoklarınızı nakde çevirin. Güvenli ve profesyonel B2B pazar yeri.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Üye Ol
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Giriş Yap
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Nasıl Çalışır?
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Kullanım Şartları
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Çerez Politikası
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  KVKK
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-white">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <a
                  href="mailto:info@stockmatch.com"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  info@stockmatch.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <a
                  href="tel:+902121234567"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  +90 (212) 123 45 67
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <span className="text-sm text-slate-400">
                  Maslak, İstanbul, Türkiye
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">
              © {currentYear} StockMatch. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <span>Türkçe</span>
              <span>•</span>
              <a href="#" className="transition-colors hover:text-white">
                English
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

