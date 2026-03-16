// ═══════════════════════════════════════════════════════
//  NexusUI CMS — API Client & Endpoint Definitions
//  Swap BASE_URL to connect to any backend
// ═══════════════════════════════════════════════════════

import type {
  Product,
  ProductVariant,
  ProductFilters,
  Collection,
  Order,
  OrderFilters,
  Customer,
  CustomerFilters,
  DiscountCode,
  AutomaticDiscount,
  FlashSale,
  StorefrontContent,
  NavMenu,
  GlobalSEO,
  PageSEO,
  StorefrontTheme,
  StoreSettings,
  MediaFile,
  PaginatedResponse,
  ApiResponse,
  ContentPage,
  BlogPost,
} from "./types";

// ── Configuration ──────────────────────────────────────
export const API_CONFIG = {
  BASE_URL:
    (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000/api/v1",
  TOKEN:
    typeof window !== "undefined"
      ? (localStorage.getItem("nexus_token") ?? "")
      : "",
  TIMEOUT: 15000,
};

// ── Base fetch wrapper ─────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_CONFIG.TOKEN}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message ?? "Request failed"), {
      status: res.status,
      errors: err.errors,
    });
  }
  return res.json() as Promise<T>;
}

function get<T>(
  path: string,
  params?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const qs = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join("&")
    : "";
  return request<T>(path + qs, { method: "GET" }, signal);
}

function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}
function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
}
function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}
function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}

// ── All Endpoint Definitions ───────────────────────────
export const API = {
  // ── PRODUCTS ─────────────────────────────────────────
  products: {
    list: (f: ProductFilters = {}) =>
      get<PaginatedResponse<Product>>(
        "/products",
        f as Record<string, unknown>,
      ),
    get: (id: string) => get<ApiResponse<Product>>(`/products/${id}`),
    create: (data: Partial<Product>) =>
      post<ApiResponse<Product>>("/products", data),
    update: (id: string, data: Partial<Product>) =>
      patch<ApiResponse<Product>>(`/products/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/products/${id}`),
    bulkDelete: (ids: string[]) =>
      post<ApiResponse<void>>("/products/bulk-delete", { ids }),
    bulkStatus: (ids: string[], status: string) =>
      post<ApiResponse<void>>("/products/bulk-status", { ids, status }),
    duplicate: (id: string) =>
      post<ApiResponse<Product>>(`/products/${id}/duplicate`, {}),
    export: (format: "csv" | "json") =>
      get<Blob>(`/products/export?format=${format}`),
    import: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return request<ApiResponse<{ imported: number }>>("/products/import", {
        method: "POST",
        body: form,
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      });
    },
  },

  // ── PRODUCT VARIANTS ─────────────────────────────────
  variants: {
    list: (productId: string) =>
      get<ApiResponse<ProductVariant[]>>(`/products/${productId}/variants`),
    create: (productId: string, data: Partial<ProductVariant>) =>
      post<ApiResponse<ProductVariant>>(
        `/products/${productId}/variants`,
        data,
      ),
    update: (productId: string, id: string, data: Partial<ProductVariant>) =>
      patch<ApiResponse<ProductVariant>>(
        `/products/${productId}/variants/${id}`,
        data,
      ),
    delete: (productId: string, id: string) =>
      del<ApiResponse<void>>(`/products/${productId}/variants/${id}`),
    adjustInventory: (productId: string, id: string, delta: number) =>
      patch<ApiResponse<ProductVariant>>(
        `/products/${productId}/variants/${id}/inventory`,
        { delta },
      ),
  },

  // ── COLLECTIONS ───────────────────────────────────────
  collections: {
    list: () => get<PaginatedResponse<Collection>>("/collections"),
    get: (id: string) => get<ApiResponse<Collection>>(`/collections/${id}`),
    create: (data: Partial<Collection>) =>
      post<ApiResponse<Collection>>("/collections", data),
    update: (id: string, data: Partial<Collection>) =>
      patch<ApiResponse<Collection>>(`/collections/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/collections/${id}`),
    addProduct: (id: string, productId: string) =>
      post<ApiResponse<void>>(`/collections/${id}/products`, { productId }),
    removeProduct: (id: string, productId: string) =>
      del<ApiResponse<void>>(`/collections/${id}/products/${productId}`),
    reorder: (id: string, productIds: string[]) =>
      put<ApiResponse<void>>(`/collections/${id}/products/reorder`, {
        productIds,
      }),
  },

  // ── ORDERS ────────────────────────────────────────────
  orders: {
    list: (f: OrderFilters = {}) =>
      get<PaginatedResponse<Order>>("/orders", f as Record<string, unknown>),
    get: (id: string) => get<ApiResponse<Order>>(`/orders/${id}`),
    update: (id: string, data: Partial<Order>) =>
      patch<ApiResponse<Order>>(`/orders/${id}`, data),
    cancel: (id: string, reason?: string) =>
      post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason }),
    close: (id: string) => post<ApiResponse<Order>>(`/orders/${id}/close`, {}),
    reopen: (id: string) =>
      post<ApiResponse<Order>>(`/orders/${id}/reopen`, {}),
    fulfill: (
      id: string,
      data: {
        lineItems: { lineItemId: string; quantity: number }[];
        trackingNumber?: string;
        trackingUrl?: string;
        carrier?: string;
        notifyCustomer?: boolean;
      },
    ) => post<ApiResponse<Order>>(`/orders/${id}/fulfillments`, data),
    refund: (
      id: string,
      data: {
        amount: number;
        note?: string;
        refundLineItems?: { lineItemId: string; quantity: number }[];
        restock?: boolean;
      },
    ) => post<ApiResponse<Order>>(`/orders/${id}/refunds`, data),
    note: (id: string, note: string) =>
      patch<ApiResponse<Order>>(`/orders/${id}`, { note }),
    tags: (id: string, tags: string[]) =>
      patch<ApiResponse<Order>>(`/orders/${id}`, { tags }),
    export: (filters: OrderFilters) =>
      get<Blob>("/orders/export", filters as Record<string, unknown>),
  },

  // ── CUSTOMERS ─────────────────────────────────────────
  customers: {
    list: (f: CustomerFilters = {}) =>
      get<PaginatedResponse<Customer>>(
        "/customers",
        f as Record<string, unknown>,
      ),
    get: (id: string) => get<ApiResponse<Customer>>(`/customers/${id}`),
    create: (data: Partial<Customer>) =>
      post<ApiResponse<Customer>>("/customers", data),
    update: (id: string, data: Partial<Customer>) =>
      patch<ApiResponse<Customer>>(`/customers/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/customers/${id}`),
    orders: (id: string) =>
      get<PaginatedResponse<Order>>(`/customers/${id}/orders`),
    sendInvite: (id: string) =>
      post<ApiResponse<void>>(`/customers/${id}/send-invite`, {}),
    export: () => get<Blob>("/customers/export"),
  },

  // ── MEDIA ─────────────────────────────────────────────
  media: {
    list: (folder?: string) =>
      get<PaginatedResponse<MediaFile>>("/media", folder ? { folder } : {}),
    upload: (files: FileList | File[], folder?: string) => {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      if (folder) form.append("folder", folder);
      return request<ApiResponse<MediaFile[]>>("/media/upload", {
        method: "POST",
        body: form,
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      });
    },
    update: (id: string, data: Partial<MediaFile>) =>
      patch<ApiResponse<MediaFile>>(`/media/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/media/${id}`),
    bulkDelete: (ids: string[]) =>
      post<ApiResponse<void>>("/media/bulk-delete", { ids }),
  },

  // ── PROMOTIONS ────────────────────────────────────────
  discounts: {
    list: () => get<PaginatedResponse<DiscountCode>>("/discounts"),
    get: (id: string) => get<ApiResponse<DiscountCode>>(`/discounts/${id}`),
    create: (data: Partial<DiscountCode>) =>
      post<ApiResponse<DiscountCode>>("/discounts", data),
    update: (id: string, data: Partial<DiscountCode>) =>
      patch<ApiResponse<DiscountCode>>(`/discounts/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/discounts/${id}`),
    lookup: (code: string) =>
      get<ApiResponse<DiscountCode>>(`/discounts/lookup?code=${code}`),
  },

  automatic: {
    list: () =>
      get<PaginatedResponse<AutomaticDiscount>>("/discounts/automatic"),
    create: (data: Partial<AutomaticDiscount>) =>
      post<ApiResponse<AutomaticDiscount>>("/discounts/automatic", data),
    update: (id: string, data: Partial<AutomaticDiscount>) =>
      patch<ApiResponse<AutomaticDiscount>>(`/discounts/automatic/${id}`, data),
    delete: (id: string) =>
      del<ApiResponse<void>>(`/discounts/automatic/${id}`),
  },

  flashSales: {
    list: () => get<PaginatedResponse<FlashSale>>("/flash-sales"),
    create: (data: Partial<FlashSale>) =>
      post<ApiResponse<FlashSale>>("/flash-sales", data),
    update: (id: string, data: Partial<FlashSale>) =>
      patch<ApiResponse<FlashSale>>(`/flash-sales/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/flash-sales/${id}`),
  },

  // ── STOREFRONT CONTENT ────────────────────────────────
  content: {
    get: () => get<ApiResponse<StorefrontContent>>("/content"),
    update: (data: Partial<StorefrontContent>) =>
      patch<ApiResponse<StorefrontContent>>("/content", data),
    // Individual sections
    announcement: (data: unknown) =>
      patch<ApiResponse<void>>("/content/announcement", data),
    hero: (data: unknown) => patch<ApiResponse<void>>("/content/hero", data),
    featured: (data: unknown) =>
      patch<ApiResponse<void>>("/content/featured", data),
    testimonials: (data: unknown) =>
      patch<ApiResponse<void>>("/content/testimonials", data),
    newsletter: (data: unknown) =>
      patch<ApiResponse<void>>("/content/newsletter", data),
  },

  pages: {
    list: () => get<PaginatedResponse<ContentPage>>("/pages"),
    get: (id: string) =>
      get<ApiResponse<ContentPage>>(`/pages/${id}`),
    create: (data: unknown) =>
      post<ApiResponse<ContentPage>>("/pages", data),
    update: (id: string, data: unknown) =>
      patch<ApiResponse<ContentPage>>(`/pages/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/pages/${id}`),
  },

  blog: {
    list: () =>
      get<PaginatedResponse<BlogPost>>("/blog/posts"),
    get: (id: string) =>
      get<ApiResponse<BlogPost>>(`/blog/posts/${id}`),
    create: (data: unknown) =>
      post<ApiResponse<BlogPost>>("/blog/posts", data),
    update: (id: string, data: unknown) =>
      patch<ApiResponse<BlogPost>>(`/blog/posts/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/blog/posts/${id}`),
  },

  // ── NAVIGATION ───────────────────────────────────────
  navigation: {
    list: () => get<ApiResponse<NavMenu[]>>("/navigation"),
    get: (id: string) => get<ApiResponse<NavMenu>>(`/navigation/${id}`),
    create: (data: Partial<NavMenu>) =>
      post<ApiResponse<NavMenu>>("/navigation", data),
    update: (id: string, data: Partial<NavMenu>) =>
      patch<ApiResponse<NavMenu>>(`/navigation/${id}`, data),
    delete: (id: string) => del<ApiResponse<void>>(`/navigation/${id}`),
  },

  // ── SEO ──────────────────────────────────────────────
  seo: {
    global: () => get<ApiResponse<GlobalSEO>>("/seo/global"),
    updateGlobal: (data: Partial<GlobalSEO>) =>
      patch<ApiResponse<GlobalSEO>>("/seo/global", data),
    pages: () => get<PaginatedResponse<PageSEO>>("/seo/pages"),
    updatePage: (id: string, data: Partial<PageSEO>) =>
      patch<ApiResponse<PageSEO>>(`/seo/pages/${id}`, data),
  },

  // ── THEME ────────────────────────────────────────────
  themes: {
    list: () => get<ApiResponse<StorefrontTheme[]>>("/themes"),
    get: (id: string) => get<ApiResponse<StorefrontTheme>>(`/themes/${id}`),
    create: (data: Partial<StorefrontTheme>) =>
      post<ApiResponse<StorefrontTheme>>("/themes", data),
    update: (id: string, data: Partial<StorefrontTheme>) =>
      patch<ApiResponse<StorefrontTheme>>(`/themes/${id}`, data),
    activate: (id: string) =>
      post<ApiResponse<void>>(`/themes/${id}/activate`, {}),
    duplicate: (id: string) =>
      post<ApiResponse<StorefrontTheme>>(`/themes/${id}/duplicate`, {}),
    delete: (id: string) => del<ApiResponse<void>>(`/themes/${id}`),
    preview: (id: string, url: string) =>
      get<ApiResponse<string>>(`/themes/${id}/preview?url=${url}`),
  },

  // ── SETTINGS ─────────────────────────────────────────
  settings: {
    get: () => get<ApiResponse<StoreSettings>>("/settings"),
    updateStore: (data: unknown) =>
      patch<ApiResponse<void>>("/settings/store", data),
    updateShipping: (data: unknown) =>
      patch<ApiResponse<void>>("/settings/shipping", data),
    addShippingZone: (data: unknown) =>
      post<ApiResponse<void>>("/settings/shipping/zones", data),
    updatePayments: (data: unknown) =>
      patch<ApiResponse<void>>("/settings/payments", data),
    updateTaxes: (data: unknown) =>
      patch<ApiResponse<void>>("/settings/taxes", data),
    updateCheckout: (data: unknown) =>
      patch<ApiResponse<void>>("/settings/checkout", data),
    updateNotifications: (data: unknown) =>
      patch<ApiResponse<void>>("/settings/notifications", data),
  },

  // ── ANALYTICS ────────────────────────────────────────
  analytics: {
    overview: (dateFrom: string, dateTo: string) =>
      get<ApiResponse<AnalyticsOverview>>("/analytics/overview", {
        dateFrom,
        dateTo,
      }),
    revenue: (period: string) =>
      get<ApiResponse<RevenueData[]>>("/analytics/revenue", { period }),
    topProducts: (limit?: number) =>
      get<ApiResponse<TopProduct[]>>("/analytics/top-products", { limit }),
    traffic: (dateFrom: string, dateTo: string) =>
      get<ApiResponse<TrafficData>>("/analytics/traffic", { dateFrom, dateTo }),
  },
};

// Minimal analytics types for the overview
export interface AnalyticsOverview {
  revenue: { value: number; change: number };
  orders: { value: number; change: number };
  customers: { value: number; change: number };
  conversionRate: { value: number; change: number };
  averageOrder: { value: number; change: number };
  sessions: { value: number; change: number };
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  title: string;
  image?: string;
  revenue: number;
  units: number;
}

export interface TrafficData {
  sessions: number;
  bounceRate: number;
  avgDuration: number;
  sources: { source: string; sessions: number; percentage: number }[];
}
