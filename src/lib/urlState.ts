import { ProductQuery } from "@/types/product";

export const DEFAULT_QUERY: ProductQuery = {
  page: 1,
  limit: 10,
  q: "",
  category: "",
  sort: "",
};

export const ALLOWED_LIMITS = [10, 20, 50] as const;

export const parseProductQuery = (searchParams: { [key: string]: string | string[] | undefined }): ProductQuery => {
  // Parse page
  const pageRaw = searchParams.page;
  let page = 1;
  if (typeof pageRaw === "string") {
    const parsedPage = parseInt(pageRaw, 10);
    if (!isNaN(parsedPage) && parsedPage >= 1) {
      page = parsedPage;
    }
  }

  // Parse limit
  const limitRaw = searchParams.limit;
  let limit: 10 | 20 | 50 = 10;
  if (typeof limitRaw === "string") {
    const parsedLimit = parseInt(limitRaw, 10);
    if (ALLOWED_LIMITS.includes(parsedLimit as any)) {
      limit = parsedLimit as 10 | 20 | 50;
    }
  }

  // Parse q (search)
  const qRaw = searchParams.q || searchParams.search;
  const q = typeof qRaw === "string" ? qRaw.trim() : "";

  // Parse category
  const categoryRaw = searchParams.category;
  const category = typeof categoryRaw === "string" ? categoryRaw.trim() : "";

  // Parse sort
  const sortRaw = searchParams.sort;
  const sort = typeof sortRaw === "string" ? sortRaw.trim() : "";

  return {
    page,
    limit,
    q,
    category,
    sort,
  };
};

export const buildQueryString = (query: Partial<ProductQuery>): string => {
  const params = new URLSearchParams();

  if (query.page && query.page > 1) {
    params.set("page", query.page.toString());
  }

  if (query.limit && query.limit !== 10) {
    params.set("limit", query.limit.toString());
  }

  if (query.q && query.q.trim()) {
    params.set("q", query.q.trim());
  }

  if (query.category && query.category.trim()) {
    params.set("category", query.category.trim());
  }

  if (query.sort && query.sort.trim()) {
    params.set("sort", query.sort.trim());
  }

  const str = params.toString();
  return str ? `?${str}` : "";
};
