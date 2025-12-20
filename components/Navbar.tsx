"use client";

type NavbarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold md:text-2xl">Waste2Export</h1>
          </div>

          {/* Search Input */}
          <div className="flex-1 md:max-w-2xl">
            <input
              type="text"
              placeholder="Ürün, marka veya parça numarası ara..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Sell Item Button */}
          <button className="rounded-lg bg-orange-600 px-6 py-2 font-semibold transition-colors hover:bg-orange-700 md:whitespace-nowrap">
            Ürün Sat
          </button>
        </div>
      </div>
    </nav>
  );
}

