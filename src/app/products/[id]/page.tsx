"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Header } from "@/components/layout/Header";
import { DetailSkeleton } from "@/components/ui/Skeleton";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { productsService } from "@/services/products.service";
import { useMutationStore } from "@/context/MutationContext";
import { Product } from "@/types/product";
import {
  ArrowLeft,
  Star,
  ShieldAlert,
  Edit2,
  Trash2,
  Truck,
  RotateCcw,
} from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80";

import { formatINR } from "@/lib/formatters";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const { getSingleProductWithMutations, isProductDeleted, mutations } = useMutationStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Modals & Toast
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const numId = parseInt(productId, 10);

    // If ID is deleted in local session mutations, immediately show not-found
    if (!isNaN(numId) && isProductDeleted(numId)) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);

    // First check if product was added locally in current session
    const addedLocal = mutations.addedProducts.find((p) => String(p.id) === String(productId));
    if (addedLocal) {
      const finalProduct = getSingleProductWithMutations(addedLocal);
      setProduct(finalProduct);
      setSelectedImage(finalProduct.thumbnail || finalProduct.images?.[0] || FALLBACK_IMAGE);
      setIsLoading(false);
      return;
    }

    productsService
      .getProductById(productId)
      .then((data) => {
        // Overlay any session updates
        const finalProduct = getSingleProductWithMutations(data);
        setProduct(finalProduct);
        setSelectedImage(finalProduct.thumbnail || finalProduct.images?.[0] || FALLBACK_IMAGE);
        setIsLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setIsLoading(false);
      });
  }, [productId, getSingleProductWithMutations, isProductDeleted, mutations.addedProducts]);

  const showToast = (title: string, message?: string) => {
    setToast({
      id: Date.now().toString(),
      type: "success",
      title,
      message,
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col">
          {/* Back Navigation Bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back to Directory</span>
            </Link>

            {product && !notFound && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <DetailSkeleton />
          ) : notFound || !product ? (
            /* Dedicated Not Found State */
            <div className="my-16 p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Product Not Found</h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  The requested product ID #{productId} could not be located. It may have been deleted or the URL is invalid.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg transition"
              >
                <span>Return to Product Directory</span>
              </Link>
            </div>
          ) : (
            /* Product Details View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Image Gallery */}
              <div className="space-y-4">
                <div className="w-full h-96 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 overflow-hidden flex items-center justify-center relative shadow-2xl">
                  <img
                    src={selectedImage || product.thumbnail || FALLBACK_IMAGE}
                    alt={product.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-4 left-4">
                    <HealthBadge product={product} />
                  </div>
                </div>

                {/* Thumbnails list */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`w-20 h-20 rounded-2xl bg-slate-900 border p-1 overflow-hidden shrink-0 transition ${
                          selectedImage === imgUrl
                            ? "border-cyan-400 ring-2 ring-cyan-500/30"
                            : "border-slate-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Information */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="text-xs text-slate-400 font-medium">by {product.brand}</span>
                    )}
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                    {product.title}
                  </h1>
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating?.toFixed(1) || "4.5"} / 5.0</span>
                  </div>
                  <div className="text-slate-300 font-medium">
                    Stock: <span className="font-bold text-slate-100">{product.stock} items available</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-100">
                    {formatINR(product.price)}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Save {product.discountPercentage}% off
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
                    {product.description}
                  </p>
                </div>

                {/* Logistics Info Badges */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                    <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{product.shippingInformation || "Standard Express Shipping"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                    <RotateCcw className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{product.returnPolicy || "30 Days Return Guarantee"}</span>
                  </div>
                </div>

                {/* Customer Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <h3 className="text-sm font-bold text-slate-200">Customer Reviews</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {product.reviews.map((rev, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200">{rev.reviewerName}</span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-slate-300 italic">&quot;{rev.comment}&quot;</p>
                          <span className="text-[10px] text-slate-500 block">{rev.date ? new Date(rev.date).toLocaleDateString() : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Modals & Toasts */}
        {product && (
          <>
            <ProductFormModal
              isOpen={editModalOpen}
              mode="edit"
              initialProduct={product}
              onClose={() => setEditModalOpen(false)}
              onSuccess={(msg) => {
                showToast("Updated", msg);
                // Refresh local product view state
                setProduct({ ...product, ...useMutationStore().mutations.updatedProducts[product.id] });
              }}
            />

            <DeleteConfirmModal
              isOpen={deleteModalOpen}
              product={product}
              onClose={() => setDeleteModalOpen(false)}
              onSuccess={() => {
                router.replace("/products");
              }}
            />
          </>
        )}

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </AuthGuard>
  );
}
