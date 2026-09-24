import apiClient from "@/lib/axios";
import { Product, ProductCategory, ProductsResponse } from "@/types/product";

export interface FetchProductsOptions {
  limit?: number;
  skip?: number;
  delay?: number;
  signal?: AbortSignal;
}

export const productsService = {
  /**
   * Fetch paginated products list from /products
   */
  async getProducts(options: FetchProductsOptions = {}): Promise<ProductsResponse> {
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

    // DummyJSON return formats can be array of strings or array of objects ({ slug, name, url })
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
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product via POST /products/add
   */
  async addProduct(product: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", product);
    return response.data;
  },

  /**
   * Update an existing product via PUT /products/{id}
   */
  async updateProduct(id: number | string, updates: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, updates);
    return response.data;
  },

  /**
   * Delete a product via DELETE /products/{id}
   */
  async deleteProduct(id: number | string): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(
      `/products/${id}`
    );
    return response.data;
  },
};
