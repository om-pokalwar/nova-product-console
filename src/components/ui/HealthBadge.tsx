import React from "react";
import { AlertTriangle, Star, CheckCircle } from "lucide-react";
import { Product } from "@/types/product";

interface HealthBadgeProps {
  product: Product;
  compact?: boolean;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ product, compact = false }) => {
  const isLowStock = product.stock < 10;
  const isStrongRating = product.rating >= 4.5;

  if (isLowStock) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 ${
          compact ? "text-[11px] px-2 py-0.5" : ""
        }`}
        title={`Low stock alert: Only ${product.stock} items remaining`}
      >
        <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-pulse" />
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        <span>Low Stock ({product.stock})</span>
      </span>
    );
  }

  if (isStrongRating) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${
          compact ? "text-[11px] px-2 py-0.5" : ""
        }`}
        title={`Strong customer rating: ${product.rating} / 5`}
      >
        <span className="w-1.5 h-3 bg-emerald-400 rounded-full" />
        <Star className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
        <span>Top Rated ({product.rating}★)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50 ${
        compact ? "text-[11px] px-2 py-0.5" : ""
      }`}
    >
      <span className="w-1.5 h-3 bg-slate-500 rounded-full" />
      <CheckCircle className="w-3 h-3 text-slate-400" />
      <span>Stock OK ({product.stock})</span>
    </span>
  );
};
