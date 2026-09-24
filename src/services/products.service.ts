import apiClient from "@/lib/axios";
import { Product, ProductCategory, ProductsResponse } from "@/types/product";
import { supabase } from "@/lib/supabase";

export interface FetchProductsOptions {
  limit?: number;
  skip?: number;
  delay?: number;
  signal?: AbortSignal;
}

export const productsService = {
  /**
   * Fetch paginated products list from /products via Axios (DummyJSON) or Supabase
   */
  async getProducts(options: FetchProductsOptions = {}): Promise<ProductsResponse> {
    if (supabase) {
      try {
        const limit = options.limit || 10;
        const skip = options.skip || 0;
        const { data, count, error } = await supabase
          .from("products")
          .select("*", { count: "exact" })
          .range(skip, skip + limit - 1);

        if (!error && data && data.length > 0) {
          return {
            products: data as Product[],
            total: count || data.length,
            skip,
            limit,
          };
        }
      } catch {
        // Fall back to DummyJSON via Axios
      }
    }

    const params: Record<string, number | string> = {};
    if (options.limit !== undefined) params.limit = options.limit;
    if (options.skip !== undefined) params.skip = options.skip;
    if (options.delay !== undefined && options.delay > 0) params.delay = options.delay;

    const response = await apiClient.get<ProductsResponse>("/products", {
      params,
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Search products by query string from /products/search?q=
   */
  async searchProducts(
    query: string,
    options: FetchProductsOptions = {}
  ): Promise<ProductsResponse> {
    const params: Record<string, number | string> = {
      q: query,
    };
    if (options.limit !== undefined) params.limit = options.limit;
    if (options.skip !== undefined) params.skip = options.skip;
    if (options.delay !== undefined && options.delay > 0) params.delay = options.delay;

    const response = await apiClient.get<ProductsResponse>("/products/search", {
      params,
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Fetch products filtered by category from /products/category/{category}
   */
  async getProductsByCategory(
    category: string,
    options: FetchProductsOptions = {}
  ): Promise<ProductsResponse> {
    const params: Record<string, number | string> = {};
    if (options.limit !== undefined) params.limit = options.limit;
    if (options.skip !== undefined) params.skip = options.skip;
    if (options.delay !== undefined && options.delay > 0) params.delay = options.delay;

    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      {
        params,
        signal: options.signal,
      }
    );
    return response.data;
  },

  /**
   * Fetch category list from /products/categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    const response = await apiClient.get<Array<string | ProductCategory>>("/products/categories");
    const data = response.data;

    return data.map((item) => {
      if (typeof item === "string") {
        return {
          slug: item,
          name: item.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          url: `https://dummyjson.com/products/category/${item}`,
        };
      }
      return item;
    });
  },

  /**
   * Fetch single product details from /products/{id}
   */
  async getProductById(id: number | string): Promise<Product> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (!error && data) {
          return data as Product;
        }
      } catch {
        // Fall back to DummyJSON
      }
    }

    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product via POST /products/add (Axios) and optionally sync with Supabase
   */
  async addProduct(product: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", product);
    const created = response.data;

    if (supabase) {
      try {
        await supabase.from("products").insert([
          {
            title: product.title,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            brand: product.brand,
            rating: product.rating || 4.5,
            thumbnail: product.thumbnail,
          },
        ]);
      } catch {
        // Continue with Axios response
      }
    }

    return created;
  },

  /**
   * Update an existing product via PUT /products/{id} (Axios) and optionally sync with Supabase
   */
  async updateProduct(id: number | string, updates: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, updates);

    if (supabase) {
      try {
        await supabase.from("products").update(updates).eq("id", id);
      } catch {
        // Continue with Axios response
      }
    }

    return response.data;
  },

  /**
   * Delete a product via DELETE /products/{id} (Axios) and optionally sync with Supabase
   */
  async deleteProduct(id: number | string): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(
      `/products/${id}`
    );

    if (supabase) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch {
        // Continue with Axios response
      }
    }

    return response.data;
  },
};
