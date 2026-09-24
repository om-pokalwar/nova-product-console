"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit2, Trash2, Star } from "lucide-react";
import { Product } from "@/types/product";
import { HealthBadge } from "@/components/ui/HealthBadge";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80";

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl hidden md:block">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800/90 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3.5 px-4">Product</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4 text-right">Price</th>
            <th className="py-3.5 px-4">Health Signal</th>
            <th className="py-3.5 px-4 text-center">Rating</th>
            <th className="py-3.5 px-4 text-center">Stock</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-xs">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-slate-800/40 transition group"
            >
              {/* Image & Title */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:border-cyan-500/50 transition cursor-pointer"
                  >
                    <img
                      src={product.thumbnail || product.images?.[0] || FALLBACK_IMAGE}
                      alt={product.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </Link>
                  <div className="min-w-0 max-w-[220px]">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-slate-100 hover:text-cyan-400 transition truncate block"
                      title={product.title}
                    >
                      {product.title}
                    </Link>
                    {product.brand && (
                      <span className="text-[11px] text-slate-400 block truncate">
                        {product.brand}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="py-3 px-4">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
                  {product.category}
                </span>
              </td>

              {/* Price */}
              <td className="py-3 px-4 text-right">
                <span className="font-bold text-slate-100 text-sm">
                  ${product.price?.toFixed(2)}
                </span>
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="block text-[10px] text-emerald-400 font-medium">
                    -{product.discountPercentage}%
                  </span>
                )}
              </td>

              {/* Health Signal */}
              <td className="py-3 px-4">
                <HealthBadge product={product} />
              </td>

              {/* Rating */}
              <td className="py-3 px-4 text-center">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-amber-400 font-semibold text-xs">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{product.rating?.toFixed(1) || "0.0"}</span>
                </div>
              </td>

              {/* Stock */}
              <td className="py-3 px-4 text-center font-medium text-slate-200">
                {product.stock}
              </td>

              {/* Actions */}
              <td className="py-3 px-4 text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <Link
                    href={`/products/${product.id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                    title="View Product Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(product);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
