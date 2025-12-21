"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, userCompany, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="text-lg font-bold text-green-500 sm:text-xl md:text-2xl">
              StockMatch
            </Link>
            {/* Navigation Links - Desktop */}
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Ürünler
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Kurumsal
              </a>
              <a
                href="#"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                İletişim
              </a>
            </div>
          </div>

          {/* Right Side - Auth State */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Auth Buttons */}
            {isLoggedIn ? (
              <div className="hidden items-center gap-3 sm:flex">
                {/* Avatar Icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                {/* Company Name */}
                <span className="hidden text-sm text-slate-700 lg:block">
                  {userCompany || "Trifaze Otomasyon A.Ş."}
                </span>

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 sm:px-4 sm:text-sm"
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 sm:px-6 sm:text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 sm:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-slate-200 pt-4 sm:hidden">
            {/* Mobile Navigation Links */}
            <div className="mb-4 flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Ürünler
              </Link>
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Kurumsal
              </a>
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                İletişim
              </a>
            </div>

            {/* Mobile Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-lg px-4 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700">
                    {userCompany || "Trifaze Otomasyon A.Ş."}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

