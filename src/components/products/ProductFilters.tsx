"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Loader2, Filter, ArrowUpDown, Plus } from "lucide-react";
import { ProductCategory, ProductQuery } from "@/types/product";
import { productsService } from "@/services/products.service";
import { DataMode } from "@/hooks/useProducts";

interface ProductFiltersProps {
  query: ProductQuery;
  dataMode: DataMode;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onResetAll: () => void;
  onOpenAddModal: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  query,
  dataMode,
  isSearching,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetAll,
  onOpenAddModal,
}) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [localSearchInput, setLocalSearchInput] = useState<string>(query.q);

  // Sync internal search input state when query.q changes from outside (e.g. clear filters)
  useEffect(() => {
    setLocalSearchInput(query.q);
  }, [query.q]);

  // Load categories on mount
  useEffect(() => {
    let isMounted = true;
    productsService
      .getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setIsLoadingCategories(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingCategories(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearchInput(val);
    onSearchChange(val);
  };

  const handleClearSearch = () => {
    setLocalSearchInput("");
    onSearchChange("");
  };

  const isFilterActive = Boolean(query.q || query.category || query.sort);

  return (
    <div className="space-y-3.5 mb-6">
      {/* Top row: Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Products Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage catalog, inspect health signals, filter, and modify inventory.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-xl flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search input with loading indicator */}
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            value={localSearchInput}
            onChange={handleSearchInput}
            placeholder="Search products by title or keywords..."
            className="w-full pl-10 pr-9 py-2 bg-slate-950/80 border border-slate-700/70 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
          {localSearchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category selector */}
        <div className="relative min-w-[180px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={query.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoadingCategories}
            className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700/70 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="relative min-w-[170px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            value={query.sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700/70 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition appearance-none cursor-pointer"
          >
            <option value="">Sort by: Default</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest First</option>
            <option value="rating-asc">Rating: Lowest First</option>
          </select>
        </div>

        {/* Reset filters button */}
        {isFilterActive && (
          <button
            onClick={onResetAll}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition"
            title="Reset all active search, category and sort filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Precedence Banner */}
      {dataMode === "search" && (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300">
          <span className="font-semibold text-cyan-400">⚡ Search Precedence Active:</span>
          <span>
            Search query &quot;{query.q}&quot; owns result set. (Category filter is dormant while search is active).
          </span>
        </div>
      )}
      {dataMode === "category" && (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-950/40 border border-teal-800/40 text-[11px] text-teal-300">
          <span className="font-semibold text-teal-400">📂 Category Mode Active:</span>
          <span>Showing products in &quot;{query.category}&quot;.</span>
        </div>
      )}
    </div>
  );
};
