"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductDto, getApiImageUrl } from "@/lib/api";

type ProductCardProps = {
  product: ProductDto;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Condition badge renkleri
  const getConditionBadgeClass = () => {
    const condition = product.condition.toLowerCase();
    if (condition.includes("sıfır") && condition.includes("kapalı")) {
      return "bg-green-100 text-green-800";
    }
    if (condition.includes("sıfır") && condition.includes("açık")) {
      return "bg-emerald-100 text-emerald-800";
    }
    if (condition.includes("yeni gibi")) {
      return "bg-blue-100 text-blue-800";
    }
    if (condition.includes("yenilenmiş")) {
      return "bg-orange-100 text-orange-800";
    }
    if (condition.includes("ikinci el")) {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-red-100 text-red-800";
  };

  // Condition text kısaltması
  const getShortCondition = () => {
    const condition = product.condition.toLowerCase();
    if (condition.includes("kapalı kutu")) return "Sıfır";
    if (condition.includes("açık kutu")) return "Açık Kutu";
    if (condition.includes("yeni gibi")) return "Yeni Gibi";
    if (condition.includes("yenilenmiş")) return "Yenilenmiş";
    if (condition.includes("ikinci el")) return "İkinci El";
    return product.condition;
  };

  // Ürün görseli
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return getApiImageUrl(primaryImage.imageUrl);
    }
    return "/placeholder-product.jpg";
  };

  // Para birimi sembolü
  const getCurrencySymbol = () => {
    switch (product.currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "TRY": return "₺";
      default: return "₺";
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
      {/* Image - Fixed Height */}
      <div className="relative h-48 w-full bg-slate-100 p-4">
        <Image
          src={getProductImage()}
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
          <span className="font-semibold">{product.brand || "Marka Belirtilmemiş"}</span>
          <span className="text-slate-300">•</span>
          <span className="line-clamp-1">{product.categoryName}</span>
        </div>

        {/* Part Number - Compact */}
        {product.partNumber && (
          <p className="mb-2 text-xs text-slate-500">
            <span className="font-mono text-[10px]">{product.partNumber}</span>
          </p>
        )}

        {/* Stock Info - Compact */}
        <div className="mb-3 text-xs text-slate-500">
          Stok: {product.quantity} Adet
        </div>

        {/* Price and Condition Row */}
        <div className="mb-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {getCurrencySymbol()}
              {product.unitPrice.toLocaleString()}
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
