"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit2, Trash2, Star } from "lucide-react";
import { Product } from "@/types/product";
import { HealthBadge } from "@/components/ui/HealthBadge";

interface ProductCardProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCardGrid: React.FC<ProductCardProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex flex-col justify-between space-y-3.5 hover:border-slate-700 transition"
        >
          {/* Header Image + Health Badge */}
          <div className="relative w-full h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            <img
              src={product.thumbnail || product.images?.[0] || "/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
            <div className="absolute top-2 left-2">
              <HealthBadge product={product} compact />
            </div>
            <div className="absolute top-2 right-2 bg-slate-950/90 border border-slate-800 rounded-full px-2 py-0.5 text-amber-400 font-bold text-xs flex items-center gap-1 shadow">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating?.toFixed(1)}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <Link
              href={`/products/${product.id}`}
              className="font-bold text-sm text-slate-100 hover:text-cyan-400 transition line-clamp-1 block"
            >
              {product.title}
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
          </div>

          {/* Price & Actions */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Price: </span>
              <span className="font-extrabold text-base text-slate-100">${product.price?.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/products/${product.id}`}
                className="p-2 rounded-lg bg-slate-800/90 text-cyan-400 hover:bg-slate-700 transition"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onEdit(product)}
                className="p-2 rounded-lg bg-slate-800/90 text-amber-400 hover:bg-slate-700 transition cursor-pointer"
                title="Edit Product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(product)}
                className="p-2 rounded-lg bg-slate-800/90 text-rose-400 hover:bg-slate-700 transition cursor-pointer"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
