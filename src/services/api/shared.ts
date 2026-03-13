import {
  AddressSchema,
  CartItemSchema,
  CategorySchema,
  ProductSchema,
  ServiceSchema,
  UserSchema,
  WishlistItemSchema,
} from '../../schema';
import { isSupabaseConfigured } from '../../supabaseClient';
import type {
  Address,
  B2BRegistration,
  BlogPost,
  CartItem,
  Category,
  ContactMessage,
  NewsletterSubscription,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  QuoteRequest,
  Service,
  SiteSettings,
  User,
  UserRole,
  WishlistItem,
} from '../../types';
import {
  cloneBlogPost,
  cloneCategory,
  cloneProduct,
  cloneService,
  cloneOrder,
  seedBlogPosts,
  seedCategories,
  seedOrders,
  seedProducts,
  seedServices,
} from '../../data/seed';
import { cloneSiteSettings, defaultSiteSettings } from '../../data/siteContent';
import { FALLBACK_IMAGE, ensureSlug, withFallbackImage } from '../../utils/catalog';
import { resolveUserRole } from '../../utils/auth';
import { normalizeSiteSettings } from '../../utils/siteContent';

export type DatabaseRow = Record<string, unknown>;

export const DEMO_USER_STORAGE_KEY = 'alrayan-demo-user';
export const PROFILES_STORAGE_KEY = 'alrayan-profiles';
export const ADDRESSES_STORAGE_KEY = 'alrayan-addresses';
export const ORDERS_STORAGE_KEY = 'alrayan-orders';
export const CONTACT_MESSAGES_STORAGE_KEY = 'alrayan-contact-messages';
export const QUOTE_REQUESTS_STORAGE_KEY = 'alrayan-quote-requests';
export const NEWSLETTER_STORAGE_KEY = 'alrayan-newsletter-subscriptions';
export const B2B_REGISTRATIONS_STORAGE_KEY = 'alrayan-b2b-registrations';
export const GUEST_CART_STORAGE_KEY = 'alrayan-cart-guest';
export const PRODUCTS_STORAGE_KEY = 'alrayan-admin-products';
export const CATEGORIES_STORAGE_KEY = 'alrayan-admin-categories';
export const BLOG_POSTS_STORAGE_KEY = 'alrayan-admin-blog-posts';
export const SERVICES_STORAGE_KEY = 'alrayan-admin-services';
export const SITE_SETTINGS_STORAGE_KEY = 'alrayan-site-settings';

let fallbackIdCounter = 0;

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateId = (prefix: string) => {
  const uniquePart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${fallbackIdCounter++}`;

  return `${prefix}-${uniquePart}`;
};

export const generateOrderNumber = () => {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0'),
  ].join('');

  return `ORD-${stamp}`;
};

const parseMaybeJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

export const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
};

export const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export const asBoolean = (value: unknown) => value === true || value === 'true' || value === 1;

export const asRecord = (value: unknown): DatabaseRow => {
  const resolved = parseMaybeJson(value);
  return resolved && typeof resolved === 'object' && !Array.isArray(resolved)
    ? (resolved as DatabaseRow)
    : {};
};

export const asRecordArray = (value: unknown): DatabaseRow[] => {
  const resolved = parseMaybeJson(value);
  return Array.isArray(resolved)
    ? resolved.filter((entry): entry is DatabaseRow => Boolean(entry) && typeof entry === 'object')
    : [];
};

export const asStringArray = (value: unknown, fallback: string[] = []) => {
  const resolved = parseMaybeJson(value);

  if (Array.isArray(resolved)) {
    return resolved.map((entry) => asString(entry)).filter(Boolean);
  }

  if (typeof resolved === 'string' && resolved.trim()) {
    return [resolved];
  }

  return fallback;
};

export const normalizeRole = (value: unknown, email?: string): UserRole => resolveUserRole(email, asString(value));

export const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const candidate = asString(value, 'pending');
  return ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(candidate)
    ? (candidate as OrderStatus)
    : 'pending';
};

export const normalizePaymentMethod = (value: unknown): PaymentMethod => {
  const candidate = asString(value, 'cash');
  return ['cash', 'vodafone', 'instapay', 'bank'].includes(candidate)
    ? (candidate as PaymentMethod)
    : 'cash';
};

export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const mergeUniqueById = <T extends { id: string }>(items: T[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

export const getCartStorageKey = (userId?: string | null) =>
  userId ? `alrayan-cart-${userId}` : GUEST_CART_STORAGE_KEY;

export const getWishlistStorageKey = (userId: string) => `alrayan-wishlist-${userId}`;

export const parseDemoUser = (): User | null => {
  try {
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

export const getStoredProfiles = () => readStorage<User[]>(PROFILES_STORAGE_KEY, []);
export const setStoredProfiles = (profiles: User[]) => writeStorage(PROFILES_STORAGE_KEY, profiles);
export const getStoredAddresses = () => readStorage<Address[]>(ADDRESSES_STORAGE_KEY, []);
export const setStoredAddresses = (addresses: Address[]) => writeStorage(ADDRESSES_STORAGE_KEY, addresses);
export const getStoredOrders = () => readStorage<Order[]>(ORDERS_STORAGE_KEY, []);
export const setStoredOrders = (orders: Order[]) => writeStorage(ORDERS_STORAGE_KEY, orders);
export const getStoredContactMessages = () => readStorage<ContactMessage[]>(CONTACT_MESSAGES_STORAGE_KEY, []);
export const setStoredContactMessages = (messages: ContactMessage[]) => writeStorage(CONTACT_MESSAGES_STORAGE_KEY, messages);
export const getStoredQuoteRequests = () => readStorage<QuoteRequest[]>(QUOTE_REQUESTS_STORAGE_KEY, []);
export const setStoredQuoteRequests = (requests: QuoteRequest[]) => writeStorage(QUOTE_REQUESTS_STORAGE_KEY, requests);
export const getStoredNewsletterSubscriptions = () =>
  readStorage<NewsletterSubscription[]>(NEWSLETTER_STORAGE_KEY, []);
export const setStoredNewsletterSubscriptions = (entries: NewsletterSubscription[]) =>
  writeStorage(NEWSLETTER_STORAGE_KEY, entries);
export const getStoredB2BRegistrations = () => readStorage<B2BRegistration[]>(B2B_REGISTRATIONS_STORAGE_KEY, []);
export const setStoredB2BRegistrations = (entries: B2BRegistration[]) =>
  writeStorage(B2B_REGISTRATIONS_STORAGE_KEY, entries);
export const getStoredCartItems = (userId?: string | null) =>
  readStorage<CartItem[]>(getCartStorageKey(userId), []);
export const setStoredCartItems = (items: CartItem[], userId?: string | null) =>
  writeStorage(getCartStorageKey(userId), items);
export const getStoredWishlistItems = (userId: string) =>
  readStorage<WishlistItem[]>(getWishlistStorageKey(userId), []);
export const setStoredWishlistItems = (items: WishlistItem[], userId: string) =>
  writeStorage(getWishlistStorageKey(userId), items);
export const getStoredProducts = () => readStorage<Product[]>(PRODUCTS_STORAGE_KEY, []);
export const setStoredProducts = (products: Product[]) => writeStorage(PRODUCTS_STORAGE_KEY, products);
export const getStoredCategories = () => readStorage<Category[]>(CATEGORIES_STORAGE_KEY, []);
export const setStoredCategories = (categories: Category[]) => writeStorage(CATEGORIES_STORAGE_KEY, categories);
export const getStoredBlogPosts = () => readStorage<BlogPost[]>(BLOG_POSTS_STORAGE_KEY, []);
export const setStoredBlogPosts = (posts: BlogPost[]) => writeStorage(BLOG_POSTS_STORAGE_KEY, posts);
export const getStoredServices = () => readStorage<Service[]>(SERVICES_STORAGE_KEY, []);
export const setStoredServices = (services: Service[]) => writeStorage(SERVICES_STORAGE_KEY, services);
export const getStoredSiteSettings = () =>
  normalizeSiteSettings(readStorage<SiteSettings | null>(SITE_SETTINGS_STORAGE_KEY, null) ?? cloneSiteSettings(defaultSiteSettings));
export const setStoredSiteSettings = (settings: SiteSettings) => writeStorage(SITE_SETTINGS_STORAGE_KEY, settings);

export const getFallbackProducts = () => {
  const stored = getStoredProducts();
  return stored.length > 0 ? stored.map(cloneProduct) : seedProducts.map(cloneProduct);
};

export const getFallbackCategories = () => {
  const stored = getStoredCategories();
  return stored.length > 0 ? stored.map(cloneCategory) : seedCategories.map(cloneCategory);
};

export const getFallbackBlogPosts = () => {
  const stored = getStoredBlogPosts();
  return stored.length > 0 ? stored.map(cloneBlogPost) : seedBlogPosts.map(cloneBlogPost);
};

export const getFallbackServices = () => {
  const stored = getStoredServices();
  return stored.length > 0 ? stored.map(cloneService) : seedServices.map(cloneService);
};

export const toUser = (row: DatabaseRow): User =>
  UserSchema.parse({
    id: asString(row.id),
    email: asString(row.email),
    name: asString(row.name || row.full_name || row.display_name, 'مستخدم الريان'),
    role: normalizeRole(row.role, asString(row.email)),
    phone: asString(row.phone) || undefined,
    company: asString(row.company) || undefined,
    createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
    updatedAt: asString(row.updated_at || row.updatedAt) || undefined,
  });

export const toProduct = (row: DatabaseRow): Product => {
  const id = asString(row.id);
  const title = asString(row.title || row.name, 'منتج صناعي');
  const price = asNumber(row.price, 0);
  const oldPrice = asNumber(row.old_price ?? row.oldPrice, 0);
  const image = asString(row.image || row.image_url, FALLBACK_IMAGE);

  return ProductSchema.parse({
    id,
    slug: ensureSlug(asString(row.slug), `${title}-${id}`),
    title,
    description: asString(row.description, 'منتج جاهز للاستخدام الصناعي والتشغيلي.'),
    price,
    oldPrice: oldPrice > price ? oldPrice : undefined,
    category: asString(row.category_slug || row.category, 'safety'),
    brand: asString(row.brand, 'AL-RAYAN'),
    image,
    images: withFallbackImage(asStringArray(row.images, [image])),
    stock: asNumber(row.stock || row.inventory, 0),
    rating: asNumber(row.rating, 0),
    reviewsCount: asNumber(row.reviews_count || row.reviewsCount, 0),
    isNew: asBoolean(row.is_new ?? row.isNew),
    isHot: asBoolean(row.is_hot ?? row.isHot),
    isSale: asBoolean(row.is_sale ?? row.isSale) || oldPrice > price,
    isActive: row.is_active === undefined && row.isActive === undefined ? true : asBoolean(row.is_active ?? row.isActive),
    createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
  });
};

export const toCategory = (row: DatabaseRow): Category =>
  CategorySchema.parse({
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    icon: asString(row.icon) || undefined,
    image: asString(row.image) || undefined,
    parent_id: asString(row.parent_id) || undefined,
    description: asString(row.description) || undefined,
    isActive: row.is_active === undefined && row.isActive === undefined ? true : asBoolean(row.is_active ?? row.isActive),
  });

export const toBlogPost = (row: DatabaseRow): BlogPost => {
  const id = asString(row.id);
  const title = asString(row.title, 'مقال صناعي');

  return {
    id,
    slug: ensureSlug(asString(row.slug), `${title}-${id}`),
    title,
    excerpt: asString(row.excerpt),
    content: asString(row.content),
    author: asString(row.author, 'فريق الريان'),
    category: asString(row.category, 'safety'),
    image: asString(row.image, FALLBACK_IMAGE),
    publishedAt: asString(row.published_at || row.publishedAt, new Date().toISOString()),
    readTime: asNumber(row.read_time || row.readTime, 4),
    featured: asBoolean(row.featured),
    isActive: row.is_active === undefined && row.isActive === undefined ? true : asBoolean(row.is_active ?? row.isActive),
  };
};

export const toService = (row: DatabaseRow): Service => {
  const id = asString(row.id);
  const title = asString(row.title, 'خدمة صناعية');
  const slug = ensureSlug(asString(row.slug), `${title}-${id}`);

  return ServiceSchema.parse({
    id,
    slug,
    title,
    description: asString(row.description),
    icon: asString(row.icon, 'service'),
    link: asString(row.link, `/services/${slug}`),
    features: asStringArray(row.features),
    details: asStringArray(row.details),
    relatedCategory: asString(row.related_category || row.relatedCategory) || undefined,
    isActive: row.is_active === undefined && row.isActive === undefined ? true : asBoolean(row.is_active ?? row.isActive),
  });
};

export const toAddress = (row: DatabaseRow): Address =>
  AddressSchema.parse({
    id: asString(row.id) || undefined,
    userId: asString(row.user_id || row.userId) || undefined,
    fullName: asString(row.full_name || row.fullName),
    phone: asString(row.phone),
    street: asString(row.street),
    city: asString(row.city),
    state: asString(row.state),
    zipCode: asString(row.zip_code || row.zipCode),
    country: asString(row.country),
    isDefault: asBoolean(row.is_default ?? row.isDefault),
    createdAt: asString(row.created_at || row.createdAt) || undefined,
    updatedAt: asString(row.updated_at || row.updatedAt) || undefined,
  });

export const toOrder = (row: DatabaseRow): Order => {
  const items = asRecordArray(row.items).map((item) => ({
    productId: asString(item.product_id || item.productId),
    quantity: asNumber(item.quantity, 1),
    price: asNumber(item.price, 0),
  }));
  const shippingFee = asNumber(row.shipping_fee || row.shippingFee, 0);
  const subtotal = asNumber(row.subtotal, items.reduce((sum, item) => sum + item.price * item.quantity, 0));

  return {
    id: asString(row.id),
    orderNumber: asString(row.order_number || row.orderNumber, generateOrderNumber()),
    userId: asString(row.user_id || row.userId),
    status: normalizeOrderStatus(row.status),
    subtotal,
    shippingFee,
    total: asNumber(row.total, subtotal + shippingFee),
    paymentMethod: normalizePaymentMethod(row.payment_method || row.paymentMethod),
    items,
    shippingAddress: toAddress(asRecord(row.shipping_address || row.shippingAddress)),
    createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
    updatedAt: asString(row.updated_at || row.updatedAt) || undefined,
  };
};

export const toCartItem = (row: DatabaseRow): CartItem => {
  const productRow = Array.isArray(row.product) ? row.product[0] : row.product;

  return CartItemSchema.parse({
    id: asString(row.id),
    userId: asString(row.user_id || row.userId) || undefined,
    productId: asString(row.product_id || row.productId),
    quantity: asNumber(row.quantity, 1),
    product: toProduct(asRecord(productRow)),
    createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
    updatedAt: asString(row.updated_at || row.updatedAt) || undefined,
  });
};

export const toWishlistItem = (row: DatabaseRow): WishlistItem => {
  const productRow = Array.isArray(row.product) ? row.product[0] : row.product;

  return WishlistItemSchema.parse({
    id: asString(row.id),
    userId: asString(row.user_id || row.userId),
    productId: asString(row.product_id || row.productId),
    product: toProduct(asRecord(productRow)),
    createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
  });
};

export const toQuoteRequest = (row: DatabaseRow): QuoteRequest => ({
  id: asString(row.id),
  userId: asString(row.user_id || row.userId) || undefined,
  company: asString(row.company),
  contactName: asString(row.contact_name || row.contactName),
  phone: asString(row.phone),
  email: asString(row.email),
  activity: asString(row.activity),
  orderSize: asString(row.order_size || row.orderSize),
  description: asString(row.description),
  status: ['new', 'reviewing', 'quoted', 'closed'].includes(asString(row.status))
    ? (asString(row.status) as QuoteRequest['status'])
    : 'new',
  createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
});

export const toContactMessage = (row: DatabaseRow): ContactMessage => ({
  id: asString(row.id),
  userId: asString(row.user_id || row.userId) || undefined,
  name: asString(row.name),
  email: asString(row.email),
  phone: asString(row.phone),
  subject: asString(row.subject),
  message: asString(row.message),
  status: ['new', 'open', 'resolved'].includes(asString(row.status))
    ? (asString(row.status) as ContactMessage['status'])
    : 'new',
  createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
});

export const toNewsletterSubscription = (row: DatabaseRow): NewsletterSubscription => ({
  id: asString(row.id),
  email: asString(row.email),
  createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
});

export const toB2BRegistration = (row: DatabaseRow): B2BRegistration => ({
  id: asString(row.id),
  userId: asString(row.user_id || row.userId) || undefined,
  companyName: asString(row.company_name || row.companyName),
  contactName: asString(row.contact_name || row.contactName),
  email: asString(row.email),
  phone: asString(row.phone),
  sector: asString(row.sector),
  expectedMonthlySpend: asString(row.expected_monthly_spend || row.expectedMonthlySpend),
  requirements: asString(row.requirements),
  status: ['pending', 'approved', 'rejected'].includes(asString(row.status))
    ? (asString(row.status) as B2BRegistration['status'])
    : 'pending',
  createdAt: asString(row.created_at || row.createdAt, new Date().toISOString()),
});

export const fromSupabaseOrFallback = async <T>(
  loadFromSupabase: () => Promise<T>,
  fallback: () => Promise<T> | T,
) => {
  if (!isSupabaseConfigured()) {
    await delay(80);
    return fallback();
  }

  try {
    return await loadFromSupabase();
  } catch {
    await delay(80);
    return fallback();
  }
};

export const getAllFallbackOrders = () => mergeUniqueById([...getStoredOrders(), ...seedOrders.map(cloneOrder)]);

export const mergeUserProfile = (baseUser: User, profile: Partial<User> | null): User =>
  UserSchema.parse({
    ...baseUser,
    name: profile?.name ?? baseUser.name,
    role: resolveUserRole(baseUser.email, profile?.role ?? baseUser.role),
    phone: profile?.phone ?? baseUser.phone,
    company: profile?.company ?? baseUser.company,
    updatedAt: profile?.updatedAt ?? baseUser.updatedAt,
  });

export const loadProfileFromFallback = (userId: string) => {
  const demoUser = parseDemoUser();
  const storedProfile = getStoredProfiles().find((profile) => profile.id === userId) ?? null;

  if (demoUser?.id === userId) {
    return mergeUserProfile(demoUser, storedProfile);
  }

  return storedProfile;
};

export const saveFallbackProfile = (profile: User) => {
  const profiles = getStoredProfiles();
  const nextProfiles = mergeUniqueById([profile, ...profiles.filter((entry) => entry.id !== profile.id)]);
  setStoredProfiles(nextProfiles);
};

export const buildSeedProductMap = () => new Map(seedProducts.map((product) => [product.id, product]));

export const enrichOrderItems = (order: Order): Order => {
  const productMap = buildSeedProductMap();

  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: item.product ?? productMap.get(item.productId),
    })),
  };
};

export const fallbackDashboardCollections = () => ({
  blogPosts: getFallbackBlogPosts(),
  services: getFallbackServices(),
});
