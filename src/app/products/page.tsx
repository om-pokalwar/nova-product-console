"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Header } from "@/components/layout/Header";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductCardGrid } from "@/components/products/ProductCard";
import { Pagination } from "@/components/products/Pagination";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { TableSkeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { parseProductQuery, buildQueryString } from "@/lib/urlState";
import { Product } from "@/types/product";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert current searchParams to key-value record for sanitization
  const rawParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    rawParams[key] = value;
  });

  const parsedQuery = parseProductQuery(rawParams);

  // Local state for instant search input binding
  const [searchInput, setSearchInput] = useState<string>(parsedQuery.q);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Modals and Toasts
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Helper to update URL query params cleanly
  const updateUrl = useCallback(
    (updates: Partial<typeof parsedQuery>) => {
      const nextQuery = {
        ...parsedQuery,
        ...updates,
      };
      const queryString = buildQueryString(nextQuery);
      router.push(`/products${queryString}`);
    },
    [parsedQuery, router]
  );

  // Sync debounced search to URL (and reset page to 1 on query change)
  useEffect(() => {
    if (debouncedSearch !== parsedQuery.q) {
      updateUrl({ q: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, parsedQuery.q, updateUrl]);

  // Fetch products with race-safe hook
  const { products, total, isLoading, isSearching, error, dataMode, refetch } =
    useProducts(parsedQuery);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
  };

  const handleCategoryChange = (category: string) => {
    updateUrl({ category, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    updateUrl({ sort });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };

  const handleLimitChange = (limit: 10 | 20 | 50) => {
    updateUrl({ limit, page: 1 });
  };

  const handleResetAll = () => {
    setSearchInput("");
    router.push("/products");
  };

  // Handlers for Add / Edit / Delete
  const handleOpenAdd = () => {
    setFormMode("add");
    setSelectedProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const showToast = (title: string, message?: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      message,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex flex-col">
        <ProductFilters
          query={parsedQuery}
          dataMode={dataMode}
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onResetAll={handleResetAll}
          onOpenAddModal={handleOpenAdd}
        />

        {/* Content Area with Loading, Empty, Error, and Data states */}
        <div className="flex-1 flex flex-col justify-between">
          {isLoading ? (
            <div>
              <div className="hidden md:block">
                <TableSkeleton rows={parsedQuery.limit} />
              </div>
              <div className="md:hidden">
                <CardSkeleton count={6} />
              </div>
            </div>
          ) : error ? (
            <EmptyState type="error" error={error} onRetry={refetch} />
          ) : products.length === 0 ? (
            <EmptyState type="empty" onResetFilters={handleResetAll} />
          ) : (
            <div className="space-y-6">
              <ProductTable
                products={products}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
              <ProductCardGrid
                products={products}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && products.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={parsedQuery.page}
                limit={parsedQuery.limit}
                total={total}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProductFormModal
        isOpen={formModalOpen}
        mode={formMode}
        initialProduct={selectedProduct}
        onClose={() => setFormModalOpen(false)}
        onSuccess={(msg) => showToast("Success", msg, "success")}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        product={productToDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onSuccess={(msg) => showToast("Deleted", msg, "info")}
      />

      {/* Toast Feedbacks */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
            Loading products...
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </AuthGuard>
  );
}
