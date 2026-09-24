"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { productsService } from "@/services/products.service";
import { AppError, Product, ProductQuery } from "@/types/product";
import { useMutationStore } from "@/context/MutationContext";

export type DataMode = "search" | "category" | "all";

export interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  isSearching: boolean;
  error: AppError | null;
  dataMode: DataMode;
  refetch: () => void;
}

export function useProducts(query: ProductQuery): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [dataMode, setDataMode] = useState<DataMode>("all");

  const { applyMutationsToList } = useMutationStore();

  // Ref to store current AbortController for race cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  // Ref to track the latest query signature to prevent stale response commits
  const latestQueryKeyRef = useRef<string>("");

  const fetchProducts = useCallback(async () => {
    // 1. Cancel previous pending request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const limit = query.limit || 10;
    const skip = ((query.page || 1) - 1) * limit;
    const queryKey = `${query.q}_${query.category}_${query.page}_${query.limit}_${query.sort}`;
    latestQueryKeyRef.current = queryKey;

    setIsLoading(true);
    setError(null);

    const isSearchActive = Boolean(query.q && query.q.trim());
    const isCategoryActive = Boolean(!isSearchActive && query.category && query.category.trim());

    if (isSearchActive) {
      setDataMode("search");
      setIsSearching(true);
    } else if (isCategoryActive) {
      setDataMode("category");
      setIsSearching(false);
    } else {
      setDataMode("all");
      setIsSearching(false);
    }

    try {
      let responseData: { products: Product[]; total: number };

      if (isSearchActive) {
        responseData = await productsService.searchProducts(query.q, {
          limit,
          skip,
          signal: controller.signal,
        });
      } else if (isCategoryActive) {
        responseData = await productsService.getProductsByCategory(query.category, {
          limit,
          skip,
          signal: controller.signal,
        });
      } else {
        responseData = await productsService.getProducts({
          limit,
          skip,
          signal: controller.signal,
        });
      }

      // Race-Safety Guard: Only commit state if this is still the active query
      if (latestQueryKeyRef.current !== queryKey) {
        return;
      }

      let fetchedProducts = responseData.products || [];
      let fetchedTotal = responseData.total || 0;

      // Apply client-side sorting if sort param is present
      if (query.sort) {
        const [field, direction] = query.sort.split("-");
        const dirMultiplier = direction === "desc" ? -1 : 1;

        fetchedProducts = [...fetchedProducts].sort((a, b) => {
          if (field === "price") return (a.price - b.price) * dirMultiplier;
          if (field === "rating") return (a.rating - b.rating) * dirMultiplier;
          if (field === "title") return a.title.localeCompare(b.title) * dirMultiplier;
          return 0;
        });
      }

      // Apply session mutation layer (adds, updates, deletes)
      const mutatedResult = applyMutationsToList(fetchedProducts, fetchedTotal, query.page);

      setProducts(mutatedResult.products);
      setTotal(mutatedResult.total);
      setIsLoading(false);
      setIsSearching(false);
    } catch (err: any) {
      // Ignore AbortError caused by intentional cancellation
      if (err?.name === "CanceledError" || err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
        return;
      }

      if (latestQueryKeyRef.current === queryKey) {
        const appErr = err as AppError;
        setError(
          appErr.message
            ? appErr
            : { message: "Failed to fetch products from server.", retryable: true }
        );
        setIsLoading(false);
        setIsSearching(false);
      }
    }
  }, [query.q, query.category, query.page, query.limit, query.sort, applyMutationsToList]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  return {
    products,
    total,
    isLoading,
    isSearching,
    error,
    dataMode,
    refetch: fetchProducts,
  };
}
