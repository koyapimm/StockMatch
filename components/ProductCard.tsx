"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/mockData";

type ProductCardProps = {
  product: Product;
};

// Gizlilik mantığı: sellerName'i asla gösterme!
// Bunun yerine maskelenmiş bir badge göster
function getMaskedSellerBadge(sellerName: string): string {
  // Seller name'den hash benzeri bir ID oluştur
  const hash = sellerName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `Supplier #${hash.toString().slice(-4)}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Condition badge renkleri
  const getConditionBadgeClass = () => {
    switch (product.condition) {
      case "Sıfır (Kapalı Kutu)":
        return "bg-green-100 text-green-800";
      case "Sıfır (Açık Kutu)":
        return "bg-emerald-100 text-emerald-800";
      case "Yeni Gibi":
        return "bg-blue-100 text-blue-800";
      case "Yenilenmiş":
        return "bg-orange-100 text-orange-800";
      case "İkinci El (Temiz)":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  // Condition text kısaltması
  const getShortCondition = () => {
    if (product.condition.includes("Kapalı Kutu")) return "Sıfır";
    if (product.condition.includes("Açık Kutu")) return "Açık Kutu";
    if (product.condition.includes("Yeni Gibi")) return "Yeni Gibi";
    if (product.condition.includes("Yenilenmiş")) return "Yenilenmiş";
    if (product.condition.includes("İkinci El")) return "İkinci El";
    return "Arızalı";
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
      {/* Image - Fixed Height */}
      <div className="relative h-48 w-full bg-slate-100 p-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Content - Compact */}
      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/product/${product.id}`}
          className="mb-2 text-sm font-bold text-slate-900 line-clamp-2 hover:text-slate-600 transition-colors"
        >
          {product.title}
        </Link>

        {/* Brand & Category - Compact */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="font-semibold">{product.brand}</span>
          <span className="text-slate-300">•</span>
          <span className="line-clamp-1">{product.subCategory}</span>
        </div>

        {/* Part Number - Compact */}
        {product.partNumber && (
          <p className="mb-2 text-xs text-slate-500">
            <span className="font-mono text-[10px]">{product.partNumber}</span>
          </p>
        )}

        {/* Stock Info - Compact */}
        <div className="mb-3 text-xs text-slate-500">
          Stok: {product.stock} Adet
        </div>

        {/* Price and Condition Row */}
        <div className="mb-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {product.currency === "USD" ? "$" : "₺"}
              {product.price.toLocaleString()}
            </p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${getConditionBadgeClass()}`}
            title={product.condition}
          >
            {getShortCondition()}
          </span>
        </div>

        {/* Action Button - Always at bottom */}
        <Link
          href={`/product/${product.id}`}
          className="mt-auto flex h-10 w-full items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          İncele
        </Link>
      </div>
    </div>
  );
}
