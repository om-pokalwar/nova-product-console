"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, Save, PackagePlus, Edit3 } from "lucide-react";
import { Product, ProductCategory } from "@/types/product";
import { productsService } from "@/services/products.service";
import { useMutationStore } from "@/context/MutationContext";

interface ProductFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialProduct?: Product | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface FormErrors {
  title?: string;
  price?: string;
  stock?: string;
  category?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  mode,
  initialProduct,
  onClose,
  onSuccess,
}) => {
  const { addLocalProduct, updateLocalProduct } = useMutationStore();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [rating, setRating] = useState<string>("4.5");
  const [thumbnail, setThumbnail] = useState<string>("");

  useEffect(() => {
    productsService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialProduct) {
      setTitle(initialProduct.title || "");
      setDescription(initialProduct.description || "");
      setPrice(initialProduct.price?.toString() || "");
      setStock(initialProduct.stock?.toString() || "");
      setCategory(initialProduct.category || "");
      setBrand(initialProduct.brand || "");
      setRating(initialProduct.rating?.toString() || "4.5");
      setThumbnail(initialProduct.thumbnail || "");
    } else {
      // Reset form for Add
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("15");
      setCategory("smartphones");
      setBrand("");
      setRating("4.5");
      setThumbnail("https://cdn.dummyjson.com/product-images/1/thumbnail.jpg");
    }
    setFormErrors({});
  }, [mode, initialProduct, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!title.trim() || title.trim().length < 2) {
      errors.title = "Title is required (minimum 2 characters).";
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.price = "Price must be a valid positive number greater than 0.";
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      errors.stock = "Stock must be a valid non-negative integer.";
    }
    if (!category.trim()) {
      errors.category = "Please select a category.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission

    if (!validate()) return;

    setIsSubmitting(true);

    const payload: Partial<Product> = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category: category.trim(),
      brand: brand.trim() || undefined,
      rating: parseFloat(rating) || 4.5,
      thumbnail: thumbnail.trim() || "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      images: [thumbnail.trim() || "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"],
    };

    try {
      if (mode === "add") {
        const result = await productsService.addProduct(payload);
        // Combine returned data + generated ID with local payload fallback
        const newProduct: Product = {
          ...result,
          id: result.id || Date.now(),
          title: payload.title!,
          description: payload.description || "",
          price: payload.price!,
          stock: payload.stock!,
          category: payload.category!,
          rating: payload.rating || 4.5,
          thumbnail: payload.thumbnail!,
          images: payload.images!,
        };
        addLocalProduct(newProduct);
        onSuccess(`Product "${newProduct.title}" created successfully.`);
      } else if (mode === "edit" && initialProduct) {
        await productsService.updateProduct(initialProduct.id, payload);
        updateLocalProduct(initialProduct.id, payload);
        onSuccess(`Product "${payload.title}" updated successfully.`);
      }
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setFormErrors({
        title: err.message || "Failed to save product. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            {mode === "add" ? (
              <PackagePlus className="w-5 h-5 text-cyan-400" />
            ) : (
              <Edit3 className="w-5 h-5 text-amber-400" />
            )}
            <h2 className="text-base font-bold text-slate-100">
              {mode === "add" ? "Create New Product" : `Edit Product #${initialProduct?.id}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            />
            {formErrors.title && <p className="text-rose-400 text-[11px] mt-1">{formErrors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Brief product description..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition resize-none"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Price ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSubmitting}
                placeholder="99.99"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
              {formErrors.price && <p className="text-rose-400 text-[11px] mt-1">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Stock Count <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={isSubmitting}
                placeholder="15"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
              {formErrors.stock && <p className="text-rose-400 text-[11px] mt-1">{formErrors.stock}</p>}
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formErrors.category && <p className="text-rose-400 text-[11px] mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Sony"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* Rating & Thumbnail URL */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Initial Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Image Thumbnail URL</label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                disabled={isSubmitting}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{mode === "add" ? "Create Product" : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
