"use client";

import { useState } from "react";

type HeroProps = {
  onHowItWorksClick: () => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
};

export default function Hero({
  onHowItWorksClick,
  onSearchChange,
  searchQuery = "",
}: HeroProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const quickCategories = ["Motors", "PLC", "Drivers", "Robotics"];

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleCategoryClick = (category: string) => {
    handleSearchChange(category);
  };

  return (
    <section className="bg-gradient-to-b from-slate-100 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Deponuzdaki Atıl Gücü Nakde Çevirin
          </h1>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative mx-auto max-w-2xl">
              <input
                type="text"
                placeholder="Ürün, marka veya parça numarası ara..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-lg placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:px-6 sm:py-4 sm:text-lg"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2 text-white transition-colors hover:bg-slate-800 sm:p-3"
                aria-label="Ara"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-xs text-slate-600 sm:text-sm">Hızlı Erişim:</span>
            {quickCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 sm:px-4 sm:py-2 sm:text-sm"
              >
                {category}
              </button>
            ))}
          </div>

          {/* How It Works Link */}
          <div className="mt-8">
            <button
              onClick={onHowItWorksClick}
              className="text-sm font-medium text-slate-600 underline transition-colors hover:text-slate-900"
            >
              Nasıl Çalışır?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

