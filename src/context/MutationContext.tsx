"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";

interface LocalMutations {
  addedProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
}

interface MutationContextType {
  mutations: LocalMutations;
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (id: number, updates: Partial<Product>) => void;
  deleteLocalProduct: (id: number) => void;
  applyMutationsToList: (apiProducts: Product[], totalCount: number, page: number) => {
    products: Product[];
    total: number;
  };
  getSingleProductWithMutations: (apiProduct: Product) => Product;
  isProductDeleted: (id: number) => boolean;
  clearMutations: () => void;
}

const STORAGE_KEY = "nova_session_mutations";

const initialMutations: LocalMutations = {
  addedProducts: [],
  updatedProducts: {},
  deletedProductIds: [],
};

const MutationContext = createContext<MutationContextType | undefined>(undefined);

export const MutationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mutations, setMutations] = useState<LocalMutations>(initialMutations);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setMutations(JSON.parse(stored));
        } catch {
          // fallback to initial
        }
      }
    }
  }, []);

  // Sync to localStorage
  const saveMutations = (newMutations: LocalMutations) => {
    setMutations(newMutations);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMutations));
    }
  };

  const addLocalProduct = (product: Product) => {
    const updated = {
      ...mutations,
      addedProducts: [product, ...mutations.addedProducts.filter((p) => p.id !== product.id)],
    };
    saveMutations(updated);
  };

  const updateLocalProduct = (id: number, updates: Partial<Product>) => {
    const updated = {
      ...mutations,
      updatedProducts: {
        ...mutations.updatedProducts,
        [id]: {
          ...(mutations.updatedProducts[id] || {}),
          ...updates,
        },
      },
    };
    saveMutations(updated);
  };

  const deleteLocalProduct = (id: number) => {
    const updated = {
      ...mutations,
      deletedProductIds: Array.from(new Set([...mutations.deletedProductIds, id])),
      addedProducts: mutations.addedProducts.filter((p) => p.id !== id),
    };
    saveMutations(updated);
  };

  const clearMutations = () => {
    saveMutations(initialMutations);
  };

  const isProductDeleted = (id: number): boolean => {
    return mutations.deletedProductIds.includes(id);
  };

  const getSingleProductWithMutations = (apiProduct: Product): Product => {
    const localUpdates = mutations.updatedProducts[apiProduct.id];
    if (localUpdates) {
      return { ...apiProduct, ...localUpdates };
    }
    return apiProduct;
  };

  const applyMutationsToList = (
    apiProducts: Product[],
    totalCount: number,
    page: number
  ): { products: Product[]; total: number } => {
    // 1. Filter out deleted products
    let filtered = apiProducts.filter(
      (p) => !mutations.deletedProductIds.includes(p.id)
    );

    // 2. Apply updates to matching items
    filtered = filtered.map((p) => {
      const updates = mutations.updatedProducts[p.id];
      if (updates) {
        return { ...p, ...updates };
      }
      return p;
    });

    // 3. Insert newly added products if on page 1
    if (page === 1 && mutations.addedProducts.length > 0) {
      // Filter out any added products that might have been deleted
      const activeAdded = mutations.addedProducts.filter(
        (p) => !mutations.deletedProductIds.includes(p.id)
      );
      filtered = [...activeAdded, ...filtered];
    }

    const netDeleted = mutations.deletedProductIds.length;
    const netAdded = mutations.addedProducts.length;
    const adjustedTotal = Math.max(0, totalCount + netAdded - netDeleted);

    return {
      products: filtered,
      total: adjustedTotal,
    };
  };

  return (
    <MutationContext.Provider
      value={{
        mutations,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        applyMutationsToList,
        getSingleProductWithMutations,
        isProductDeleted,
        clearMutations,
      }}
    >
      {children}
    </MutationContext.Provider>
  );
};

export const useMutationStore = () => {
  const context = useContext(MutationContext);
  if (!context) {
    throw new Error("useMutationStore must be used within a MutationProvider");
  }
  return context;
};
