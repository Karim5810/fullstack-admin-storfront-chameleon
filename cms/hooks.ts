// ═══════════════════════════════════════════════════════
//  NexusUI CMS — React Hooks
//  Uses real API calls with localStorage mock fallback
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";
import { API } from "./api";
import type {
  Product,
  ProductFilters,
  Collection,
  Order,
  OrderFilters,
  Customer,
  CustomerFilters,
  DiscountCode,
  FlashSale,
  StorefrontContent,
  NavMenu,
  GlobalSEO,
  StorefrontTheme,
  StoreSettings,
  MediaFile,
  PaginatedResponse,
} from "./types";

// ── Generic fetch hook ─────────────────────────────────
function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  const fetch_ = useCallback(async () => {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res);
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError")
        setError((e as Error).message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch_();
    return () => ctrl.current?.abort();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

// ── Mock data generators ───────────────────────────────
function mockPaginated<T>(items: T[]): PaginatedResponse<T> {
  return {
    data: items,
    total: items.length,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };
}

// ── PRODUCTS ──────────────────────────────────────────
export function useProducts(filters: ProductFilters = {}) {
  const key = JSON.stringify(filters);

  const { data, loading, error, refetch } = useFetch(
    () => API.products.list(filters).catch(() => mockPaginated(MOCK_PRODUCTS)),
    [key],
  );

  const create = useCallback(
    async (product: Partial<Product>) => {
      const res = await API.products.create(product).catch(() => ({
        data: {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Product,
      }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, product: Partial<Product>) => {
      const res = await API.products
        .update(id, product)
        .catch(() => ({ data: product as Product }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await API.products.delete(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const bulkStatus = useCallback(
    async (ids: string[], status: Product["status"]) => {
      await API.products.bulkStatus(ids, status).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    products: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    bulkStatus,
  };
}

// ── COLLECTIONS ───────────────────────────────────────
export function useCollections() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.collections.list().catch(() => mockPaginated(MOCK_COLLECTIONS)),
  );

  const create = useCallback(
    async (c: Partial<Collection>) => {
      const res = await API.collections
        .create(c)
        .catch(() => ({ data: c as Collection }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, c: Partial<Collection>) => {
      const res = await API.collections
        .update(id, c)
        .catch(() => ({ data: c as Collection }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await API.collections.delete(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    collections: data?.data ?? [],
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}

// ── ORDERS ────────────────────────────────────────────
export function useOrders(filters: OrderFilters = {}) {
  const key = JSON.stringify(filters);

  const { data, loading, error, refetch } = useFetch(
    () => API.orders.list(filters).catch(() => mockPaginated(MOCK_ORDERS)),
    [key],
  );

  const cancel = useCallback(
    async (id: string, reason?: string) => {
      await API.orders.cancel(id, reason).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const fulfill = useCallback(
    async (id: string, data: Parameters<typeof API.orders.fulfill>[1]) => {
      await API.orders.fulfill(id, data).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const refund = useCallback(
    async (id: string, data: Parameters<typeof API.orders.refund>[1]) => {
      await API.orders.refund(id, data).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const addNote = useCallback(
    async (id: string, note: string) => {
      await API.orders.note(id, note).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    orders: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    loading,
    error,
    refetch,
    cancel,
    fulfill,
    refund,
    addNote,
  };
}

// ── CUSTOMERS ─────────────────────────────────────────
export function useCustomers(filters: CustomerFilters = {}) {
  const key = JSON.stringify(filters);

  const { data, loading, error, refetch } = useFetch(
    () =>
      API.customers.list(filters).catch(() => mockPaginated(MOCK_CUSTOMERS)),
    [key],
  );

  const create = useCallback(
    async (c: Partial<Customer>) => {
      const res = await API.customers
        .create(c)
        .catch(() => ({ data: c as Customer }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, c: Partial<Customer>) => {
      const res = await API.customers
        .update(id, c)
        .catch(() => ({ data: c as Customer }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await API.customers.delete(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    customers: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}

// ── MEDIA ─────────────────────────────────────────────
export function useMedia(folder?: string) {
  const { data, loading, error, refetch } = useFetch(
    () => API.media.list(folder).catch(() => mockPaginated(MOCK_MEDIA)),
    [folder],
  );

  const upload = useCallback(
    async (files: FileList | File[], folder_?: string) => {
      // In dev, create mock URLs
      const mocks: MediaFile[] = Array.from(files).map((f, i) => ({
        id: Date.now() + i + "",
        url: URL.createObjectURL(f),
        filename: f.name,
        mimeType: f.type,
        size: f.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      const res = await API.media
        .upload(files, folder_)
        .catch(() => ({ data: mocks }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await API.media.delete(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const updateAlt = useCallback(
    async (id: string, alt: string) => {
      await API.media.update(id, { alt }).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    files: data?.data ?? [],
    total: data?.total ?? 0,
    loading,
    error,
    refetch,
    upload,
    remove,
    updateAlt,
  };
}

// ── DISCOUNTS ─────────────────────────────────────────
export function useDiscounts() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.discounts.list().catch(() => mockPaginated(MOCK_DISCOUNTS)),
  );

  const create = useCallback(
    async (d: Partial<DiscountCode>) => {
      const res = await API.discounts
        .create(d)
        .catch(() => ({ data: d as DiscountCode }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, d: Partial<DiscountCode>) => {
      const res = await API.discounts
        .update(id, d)
        .catch(() => ({ data: d as DiscountCode }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await API.discounts.delete(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    discounts: data?.data ?? [],
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}

export function useFlashSales() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.flashSales.list().catch(() => mockPaginated([] as FlashSale[])),
  );

  const create = useCallback(
    async (d: Partial<FlashSale>) => {
      const res = await API.flashSales
        .create(d)
        .catch(() => ({ data: d as FlashSale }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, d: Partial<FlashSale>) => {
      const res = await API.flashSales
        .update(id, d)
        .catch(() => ({ data: d as FlashSale }));
      refetch();
      return res.data;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await API.flashSales.delete(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    sales: data?.data ?? [],
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}

// ── CONTENT ───────────────────────────────────────────
export function useContent() {
  const [content, setContent] = useState<StorefrontContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.content
      .get()
      .then((res) => setContent(res.data))
      .catch(() => {
        const saved = localStorage.getItem("nexus_content");
        if (saved) setContent(JSON.parse(saved));
      })
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(
    async (section: keyof StorefrontContent, data: unknown) => {
      setSaving(true);
      const updated = { ...content, [section]: data } as StorefrontContent;
      try {
        await API.content.update({ [section]: data }).catch(() => {});
        setContent(updated);
        localStorage.setItem("nexus_content", JSON.stringify(updated));
      } finally {
        setSaving(false);
      }
    },
    [content],
  );

  return { content, loading, error, saving, save };
}

// ── NAVIGATION ────────────────────────────────────────
export function useNavigation() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.navigation.list().catch(() => ({ data: MOCK_MENUS })),
  );

  const update = useCallback(
    async (id: string, menu: Partial<NavMenu>) => {
      await API.navigation.update(id, menu).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const create = useCallback(
    async (menu: Partial<NavMenu>) => {
      await API.navigation.create(menu).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return { menus: data?.data ?? [], loading, error, refetch, update, create };
}

// ── SEO ───────────────────────────────────────────────
export function useGlobalSEO() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.seo.global().catch(() => ({ data: MOCK_GLOBAL_SEO })),
  );

  const update = useCallback(
    async (seo: Partial<GlobalSEO>) => {
      await API.seo.updateGlobal(seo).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return { seo: data?.data ?? null, loading, error, update };
}

// ── THEME ─────────────────────────────────────────────
export function useThemes() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.themes.list().catch(() => ({ data: [MOCK_THEME] })),
  );

  const update = useCallback(
    async (id: string, theme: Partial<StorefrontTheme>) => {
      await API.themes.update(id, theme).catch(() => {});
      refetch();
    },
    [refetch],
  );

  const activate = useCallback(
    async (id: string) => {
      await API.themes.activate(id).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    themes: data?.data ?? [],
    loading,
    error,
    refetch,
    update,
    activate,
  };
}

// ── SETTINGS ──────────────────────────────────────────
export function useSettings() {
  const { data, loading, error, refetch } = useFetch(() =>
    API.settings
      .get()
      .catch(() => ({ data: MOCK_SETTINGS as unknown as StoreSettings })),
  );

  const updateStore = useCallback(
    async (d: unknown) => {
      await API.settings.updateStore(d).catch(() => {});
      refetch();
    },
    [refetch],
  );
  const updateShipping = useCallback(
    async (d: unknown) => {
      await API.settings.updateShipping(d).catch(() => {});
      refetch();
    },
    [refetch],
  );
  const updatePayments = useCallback(
    async (d: unknown) => {
      await API.settings.updatePayments(d).catch(() => {});
      refetch();
    },
    [refetch],
  );
  const updateCheckout = useCallback(
    async (d: unknown) => {
      await API.settings.updateCheckout(d).catch(() => {});
      refetch();
    },
    [refetch],
  );
  const updateNotifications = useCallback(
    async (d: unknown) => {
      await API.settings.updateNotifications(d).catch(() => {});
      refetch();
    },
    [refetch],
  );

  return {
    settings: data?.data ?? null,
    loading,
    error,
    refetch,
    updateStore,
    updateShipping,
    updatePayments,
    updateCheckout,
    updateNotifications,
  };
}

// ══════════════════════════════════════════════════════
//  MOCK DATA — used when API is unreachable (dev mode)
// ══════════════════════════════════════════════════════

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Classic White Tee",
    handle: "classic-white-tee",
    description: "<p>Premium cotton t-shirt.</p>",
    tags: ["clothing", "basics"],
    status: "active",
    images: [
      {
        id: "i1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        alt: "White Tee",
        position: 1,
      },
    ],
    options: [
      { name: "Size", values: ["S", "M", "L", "XL"] },
      { name: "Color", values: ["White", "Black"] },
    ],
    variants: [
      {
        id: "v1",
        productId: "p1",
        title: "White / M",
        sku: "WTE-WH-M",
        price: 29.99,
        inventory: 45,
        inventoryPolicy: "deny",
        requiresShipping: true,
        taxable: true,
        options: { Color: "White", Size: "M" },
        position: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    collections: ["col1"],
    seo: {},
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "p2",
    title: "Slim Fit Jeans",
    handle: "slim-fit-jeans",
    description: "<p>Modern slim fit denim.</p>",
    tags: ["clothing", "denim"],
    status: "active",
    images: [
      {
        id: "i2",
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        alt: "Jeans",
        position: 1,
      },
    ],
    options: [{ name: "Size", values: ["28", "30", "32", "34"] }],
    variants: [
      {
        id: "v2",
        productId: "p2",
        title: "30",
        sku: "SFJ-30",
        price: 89.99,
        inventory: 20,
        inventoryPolicy: "deny",
        requiresShipping: true,
        taxable: true,
        options: { Size: "30" },
        position: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    collections: ["col1"],
    seo: {},
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "p3",
    title: "Leather Sneakers",
    handle: "leather-sneakers",
    description: "<p>Handcrafted leather.</p>",
    tags: ["shoes", "leather"],
    status: "active",
    images: [
      {
        id: "i3",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        alt: "Shoes",
        position: 1,
      },
    ],
    options: [{ name: "Size", values: ["7", "8", "9", "10", "11"] }],
    variants: [
      {
        id: "v3",
        productId: "p3",
        title: "9",
        sku: "LS-9",
        price: 149.99,
        inventory: 8,
        inventoryPolicy: "deny",
        requiresShipping: true,
        taxable: true,
        options: { Size: "9" },
        position: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    collections: ["col2"],
    seo: {},
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "p4",
    title: "Canvas Tote Bag",
    handle: "canvas-tote-bag",
    description: "<p>Eco-friendly canvas.</p>",
    tags: ["accessories", "eco"],
    status: "draft",
    images: [
      {
        id: "i4",
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
        alt: "Tote",
        position: 1,
      },
    ],
    options: [],
    variants: [
      {
        id: "v4",
        productId: "p4",
        title: "Default",
        sku: "CTB-001",
        price: 35.0,
        inventory: 100,
        inventoryPolicy: "continue",
        requiresShipping: true,
        taxable: true,
        options: {},
        position: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    collections: ["col3"],
    seo: {},
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
];

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col1",
    title: "Clothing",
    handle: "clothing",
    productCount: 2,
    sortOrder: "manual",
    published: true,
    seo: {},
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "col2",
    title: "Shoes",
    handle: "shoes",
    productCount: 1,
    sortOrder: "manual",
    published: true,
    seo: {},
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "col3",
    title: "Accessories",
    handle: "accessories",
    productCount: 1,
    sortOrder: "manual",
    published: true,
    seo: {},
    createdAt: "",
    updatedAt: "",
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    orderNumber: 1001,
    name: "#1001",
    status: "open",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    email: "alex@example.com",
    lineItems: [
      {
        id: "li1",
        title: "Classic White Tee",
        variantTitle: "White / M",
        quantity: 2,
        price: 29.99,
        requiresShipping: true,
        taxable: true,
      },
    ],
    subtotalPrice: 59.98,
    totalShipping: 5.0,
    totalTax: 4.8,
    totalDiscounts: 0,
    totalPrice: 69.78,
    currency: "USD",
    tags: [],
    fulfillments: [],
    refunds: [],
    createdAt: "2024-06-10T14:00:00Z",
    updatedAt: "2024-06-10T14:00:00Z",
  },
  {
    id: "o2",
    orderNumber: 1002,
    name: "#1002",
    status: "open",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    email: "sam@example.com",
    lineItems: [
      {
        id: "li2",
        title: "Slim Fit Jeans",
        quantity: 1,
        price: 89.99,
        requiresShipping: true,
        taxable: true,
      },
    ],
    subtotalPrice: 89.99,
    totalShipping: 0,
    totalTax: 7.2,
    totalDiscounts: 10,
    totalPrice: 87.19,
    currency: "USD",
    tags: [],
    fulfillments: [
      {
        id: "f1",
        orderId: "o2",
        status: "success",
        lineItems: [],
        createdAt: "",
        updatedAt: "",
      },
    ],
    refunds: [],
    createdAt: "2024-06-11T09:00:00Z",
    updatedAt: "2024-06-11T09:00:00Z",
  },
  {
    id: "o3",
    orderNumber: 1003,
    name: "#1003",
    status: "closed",
    paymentStatus: "refunded",
    fulfillmentStatus: "restocked",
    email: "jordan@example.com",
    lineItems: [
      {
        id: "li3",
        title: "Leather Sneakers",
        quantity: 1,
        price: 149.99,
        requiresShipping: true,
        taxable: true,
      },
    ],
    subtotalPrice: 149.99,
    totalShipping: 10,
    totalTax: 12.0,
    totalDiscounts: 0,
    totalPrice: 171.99,
    currency: "USD",
    tags: [],
    fulfillments: [],
    refunds: [
      {
        id: "r1",
        orderId: "o3",
        amount: 171.99,
        note: "Customer request",
        transactions: [
          { id: "t1", amount: 171.99, gateway: "stripe", status: "success" },
        ],
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "2024-06-09T16:00:00Z",
    updatedAt: "2024-06-12T10:00:00Z",
  },
];

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@example.com",
    ordersCount: 5,
    totalSpent: 342.5,
    currency: "USD",
    tags: ["vip"],
    acceptsMarketing: true,
    verified: true,
    taxExempt: false,
    state: "enabled",
    addresses: [],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-06-10T10:00:00Z",
  },
  {
    id: "c2",
    firstName: "Sam",
    lastName: "Rivera",
    email: "sam@example.com",
    ordersCount: 2,
    totalSpent: 177.18,
    currency: "USD",
    tags: [],
    acceptsMarketing: false,
    verified: true,
    taxExempt: false,
    state: "enabled",
    addresses: [],
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-06-11T10:00:00Z",
  },
  {
    id: "c3",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan@example.com",
    ordersCount: 1,
    totalSpent: 171.99,
    currency: "USD",
    tags: [],
    acceptsMarketing: true,
    verified: true,
    taxExempt: false,
    state: "enabled",
    addresses: [],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-12T10:00:00Z",
  },
];

const MOCK_DISCOUNTS: DiscountCode[] = [
  {
    id: "d1",
    code: "SAVE10",
    type: "percentage",
    value: 10,
    usageCount: 45,
    usageLimit: 100,
    oncePerCustomer: false,
    appliesTo: "all",
    active: true,
    combinesWith: { discountCodes: false, shippingDiscounts: true },
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "d2",
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    usageCount: 23,
    oncePerCustomer: true,
    appliesTo: "all",
    active: true,
    combinesWith: { discountCodes: true, shippingDiscounts: false },
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "d3",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    usageCount: 8,
    usageLimit: 50,
    oncePerCustomer: true,
    appliesTo: "all",
    active: false,
    combinesWith: { discountCodes: false, shippingDiscounts: false },
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z",
  },
];

const MOCK_MEDIA: MediaFile[] = [
  {
    id: "m1",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    filename: "white-tee.jpg",
    mimeType: "image/jpeg",
    size: 245000,
    width: 400,
    height: 400,
    alt: "White T-Shirt",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "m2",
    url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    filename: "jeans.jpg",
    mimeType: "image/jpeg",
    size: 312000,
    width: 400,
    height: 400,
    alt: "Slim Fit Jeans",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "m3",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    filename: "sneakers.jpg",
    mimeType: "image/jpeg",
    size: 198000,
    width: 400,
    height: 400,
    alt: "Leather Sneakers",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "m4",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    filename: "hero-1.jpg",
    mimeType: "image/jpeg",
    size: 458000,
    width: 1920,
    height: 1080,
    alt: "Hero Banner",
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z",
  },
];

const MOCK_MENUS: NavMenu[] = [
  {
    id: "menu1",
    title: "Main Menu",
    handle: "main-menu",
    items: [
      { id: "n1", label: "Home", url: "/", position: 1 },
      {
        id: "n2",
        label: "Shop",
        url: "/collections",
        position: 2,
        children: [
          {
            id: "n2a",
            label: "Clothing",
            url: "/collections/clothing",
            position: 1,
          },
          { id: "n2b", label: "Shoes", url: "/collections/shoes", position: 2 },
          {
            id: "n2c",
            label: "Accessories",
            url: "/collections/accessories",
            position: 3,
          },
        ],
      },
      { id: "n3", label: "About", url: "/pages/about", position: 3 },
      { id: "n4", label: "Contact", url: "/pages/contact", position: 4 },
    ],
  },
  {
    id: "menu2",
    title: "Footer — Company",
    handle: "footer-company",
    items: [
      { id: "f1", label: "About Us", url: "/pages/about", position: 1 },
      { id: "f2", label: "Careers", url: "/pages/careers", position: 2 },
      { id: "f3", label: "Press", url: "/pages/press", position: 3 },
    ],
  },
  {
    id: "menu3",
    title: "Footer — Legal",
    handle: "footer-legal",
    items: [
      { id: "l1", label: "Privacy Policy", url: "/pages/privacy", position: 1 },
      { id: "l2", label: "Terms of Service", url: "/pages/terms", position: 2 },
      { id: "l3", label: "Returns", url: "/pages/returns", position: 3 },
    ],
  },
];

const MOCK_GLOBAL_SEO: GlobalSEO = {
  siteName: "My Store",
  titleTemplate: "{page} | {siteName}",
  defaultTitle: "My Store — Premium Products",
  defaultDescription: "Discover our curated collection of premium products.",
  defaultOgImage: "",
  twitterHandle: "@mystore",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  facebookPixelId: "",
  robots:
    "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://mystore.com/sitemap.xml",
};

const MOCK_THEME: StorefrontTheme = {
  id: "t1",
  name: "Default",
  active: true,
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#ec4899",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    textSecondary: "#cbd5e1",
    border: "#334155",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    buttonText: "#ffffff",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    baseFontSize: 16,
    headingWeight: "800",
    lineHeight: 1.6,
  },
  buttons: { borderRadius: 12, style: "solid", shadow: true, uppercase: false },
  header: {
    sticky: true,
    transparent: false,
    height: 64,
    logoMaxWidth: 140,
    showSearch: true,
    showCart: true,
    showAccount: true,
    showWishlist: true,
  },
  footer: {
    columns: 4,
    showNewsletter: true,
    showSocial: true,
    backgroundColor: "#1e293b",
  },
  productCard: {
    showVendor: false,
    showRating: true,
    showSwatches: true,
    hoverEffect: "alt-image",
    aspectRatio: "3:4",
    borderRadius: 12,
  },
  layout: { containerMaxWidth: 1400, gridGap: 24, sectionSpacing: 80 },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
};

const MOCK_SETTINGS = {
  store: {
    name: "My Store",
    email: "hello@mystore.com",
    currency: "USD",
    currencySymbol: "$",
    weightUnit: "kg",
    timezone: "America/New_York",
    domain: "mystore.com",
  },
  shipping: [
    {
      id: "sz1",
      name: "Domestic",
      countries: ["US"],
      rates: [
        { id: "sr1", name: "Standard Shipping", price: 5.99 },
        { id: "sr2", name: "Express Shipping", price: 14.99 },
      ],
      createdAt: "",
      updatedAt: "",
    },
  ],
  payments: [
    {
      id: "pp1",
      name: "Stripe",
      provider: "stripe",
      enabled: true,
      config: { publishableKey: "pk_test_..." },
      testMode: true,
      createdAt: "",
      updatedAt: "",
    },
  ],
  taxes: [
    {
      id: "tx1",
      country: "US",
      rate: 8.5,
      name: "US Sales Tax",
      shipping: false,
      createdAt: "",
      updatedAt: "",
    },
  ],
  checkout: {
    requiresAccount: false,
    allowGuestCheckout: true,
    showCompanyField: false,
    showPhoneField: true,
    requirePhone: false,
    noteEnabled: true,
    tippingEnabled: false,
    tippingPercentages: [15, 20, 25],
    abandonedCartRecovery: true,
    abandonedCartDelay: 60,
  },
  notifications: {
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    orderCancelled: true,
    refundProcessed: true,
    customerWelcome: true,
    passwordReset: true,
    abandonedCart: true,
    senderEmail: "noreply@mystore.com",
    senderName: "My Store",
  },
};

export const DEFAULT_CONTENT: StorefrontContent = {
  announcementBar: {
    enabled: true,
    text: "🎉 Free shipping on orders over $75 — Limited time!",
    link: "/collections",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    dismissible: true,
  },
  hero: {
    slides: [
      {
        id: "h1",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920",
        headline: "New Collection",
        subheadline: "Discover premium pieces for every occasion",
        ctaLabel: "Shop Now",
        ctaUrl: "/collections",
        overlay: 40,
        position: 1,
      },
    ],
    autoplay: true,
    autoplayDelay: 5,
    showDots: true,
    showArrows: true,
    height: "large",
  },
  featuredCollections: [
    {
      enabled: true,
      title: "Shop by Category",
      collectionId: "col1",
      displayCount: 8,
      layout: "grid",
      showViewAll: true,
    },
  ],
  testimonials: [
    {
      id: "t1",
      author: "Alex M.",
      text: "Incredible quality and fast shipping. Will definitely order again!",
      rating: 5,
      active: true,
    },
    {
      id: "t2",
      author: "Sam R.",
      text: "The best online shopping experience I've had in years.",
      rating: 5,
      active: true,
    },
    {
      id: "t3",
      author: "Jordan L.",
      text: "Beautifully packaged, exactly as described.",
      rating: 4,
      active: true,
    },
  ],
  newsletter: {
    enabled: true,
    title: "Join the community",
    subtitle: "Get exclusive deals and new arrivals first.",
    placeholder: "Enter your email",
    buttonLabel: "Subscribe",
  },
  pages: [],
  blog: [],
};
