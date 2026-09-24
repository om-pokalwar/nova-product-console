"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Product } from "@/types/product";
import { productsService } from "@/services/products.service";
import { useMutationStore } from "@/context/MutationContext";

interface DeleteConfirmModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const { deleteLocalProduct } = useMutationStore();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!product) return null;

  const handleDelete = async () => {
    if (isDeleting) return; // Lock duplicate clicks

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      await productsService.deleteProduct(product.id);
      deleteLocalProduct(product.id);
      setIsDeleting(false);
      onSuccess(`Product "${product.title}" has been deleted.`);
      onClose();
    } catch (err: any) {
      // Even if server returns error or simulated delete, apply local deletion for continuous workflow
      deleteLocalProduct(product.id);
      setIsDeleting(false);
      onSuccess(`Product "${product.title}" removed from session view.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-100">
            Delete &quot;{product.title}&quot;?
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Are you sure you want to delete this product? This action will remove it from your session workspace and catalog view immediately.
          </p>
        </div>

        {errorMsg && <p className="text-xs text-rose-400 bg-rose-950/30 p-2 rounded-lg">{errorMsg}</p>}

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 disabled:opacity-50 transition active:scale-95 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
