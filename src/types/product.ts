export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Meta;
  thumbnail: string;
  images: string[];
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = "title" | "price" | "rating";
export type SortOrder = "asc" | "desc";

export interface ProductQuery {
  page: number;
  limit: 10 | 20 | 50;
  q: string;
  category: string;
  sort: string; // e.g. "price-asc", "title-desc", "rating-desc"
}

export interface AppError {
  message: string;
  status?: number;
  retryable: boolean;
}
