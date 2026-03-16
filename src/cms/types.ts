// ═══════════════════════════════════════════════════════
//  NexusUI CMS — Complete E-Commerce Type Definitions
// ═══════════════════════════════════════════════════════

// ── Shared ───────────────────────────────────────────
export type ID = string;
export type ISO8601 = string;
export type Currency = number; // stored as cents

export interface Meta {
  id: ID;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface SEOMeta {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
}

export interface Money {
  amount: number;
  currency: string;
}

// ── Media ─────────────────────────────────────────────
export interface MediaFile extends Meta {
  url: string;
  filename: string;
  mimeType: string;
  size: number; // bytes
  width?: number;
  height?: number;
  alt?: string;
  folder?: string;
  tags?: string[];
}

// ── Products ──────────────────────────────────────────
export type ProductStatus = "draft" | "active" | "archived";

export interface ProductOption {
  name: string; // "Size", "Color"
  values: string[]; // ["S","M","L"]
}

export interface ProductVariant extends Meta {
  productId: ID;
  title: string; // "Red / M"
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  inventory: number;
  inventoryPolicy: "deny" | "continue";
  weight?: number;
  weightUnit?: "kg" | "lb" | "g" | "oz";
  requiresShipping: boolean;
  taxable: boolean;
  image?: string;
  options: Record<string, string>; // {Color:"Red", Size:"M"}
  position: number;
}

export interface ProductImage {
  id: ID;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  position: number;
}

export interface Product extends Meta {
  title: string;
  handle: string; // URL slug
  description: string; // HTML
  descriptionText?: string; // plain text
  vendor?: string;
  productType?: string;
  tags: string[];
  status: ProductStatus;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  collections: ID[];
  seo: SEOMeta;
  publishedAt?: ISO8601;
  templateSuffix?: string;
  metafields?: Record<string, string>;
  averageRating?: number;
  reviewCount?: number;
}

export interface ProductFilters {
  status?: ProductStatus;
  collection?: ID;
  vendor?: string;
  tag?: string;
  search?: string;
  sort?: "title" | "price" | "created" | "updated" | "inventory";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ── Collections ───────────────────────────────────────
export interface Collection extends Meta {
  title: string;
  handle: string;
  description?: string;
  image?: string;
  productCount?: number;
  sortOrder:
    | "manual"
    | "alpha-asc"
    | "alpha-desc"
    | "price-asc"
    | "price-desc"
    | "created"
    | "created-desc";
  published: boolean;
  seo: SEOMeta;
  ruleSet?: CollectionRule[];
  disjunctive?: boolean; // any vs all rules
}

export interface CollectionRule {
  column: "title" | "tag" | "price" | "vendor" | "type" | "variant_inventory";
  relation: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
  condition: string;
}

// ── Orders ────────────────────────────────────────────
export type OrderStatus = "pending" | "open" | "closed" | "cancelled";
export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "partially_paid"
  | "refunded"
  | "partially_refunded"
  | "voided";
export type FulfillmentStatus =
  | "unfulfilled"
  | "partial"
  | "fulfilled"
  | "restocked";

export interface OrderLineItem {
  id: ID;
  productId?: ID;
  variantId?: ID;
  title: string;
  variantTitle?: string;
  sku?: string;
  quantity: number;
  price: number;
  totalDiscount?: number;
  image?: string;
  requiresShipping: boolean;
  taxable: boolean;
  vendor?: string;
  properties?: Record<string, string>;
}

export interface Fulfillment extends Meta {
  orderId: ID;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  status: "pending" | "open" | "success" | "cancelled" | "error";
  lineItems: { lineItemId: ID; quantity: number }[];
}

export interface Order extends Meta {
  orderNumber: number;
  name: string; // "#1001"
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer?: CustomerRef;
  email?: string;
  phone?: string;
  lineItems: OrderLineItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  subtotalPrice: number;
  totalShipping: number;
  totalTax: number;
  totalDiscounts: number;
  totalPrice: number;
  currency: string;
  note?: string;
  tags: string[];
  cancelledAt?: ISO8601;
  cancelReason?: string;
  closedAt?: ISO8601;
  processedAt?: ISO8601;
  source?: string;
  gateway?: string;
  fulfillments: Fulfillment[];
  refunds: Refund[];
  riskLevel?: "low" | "medium" | "high";
}

export interface Refund extends Meta {
  orderId: ID;
  note?: string;
  amount: number;
  transactions: RefundTransaction[];
}

export interface RefundTransaction {
  id: ID;
  amount: number;
  gateway: string;
  status: "success" | "pending" | "failure";
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  search?: string;
  dateFrom?: ISO8601;
  dateTo?: ISO8601;
  page?: number;
  limit?: number;
}

// ── Customers ─────────────────────────────────────────
export interface CustomerRef {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Customer extends Meta {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: ID;
  ordersCount: number;
  totalSpent: number;
  currency: string;
  tags: string[];
  acceptsMarketing: boolean;
  marketingOptInAt?: ISO8601;
  verified: boolean;
  note?: string;
  taxExempt: boolean;
  lastOrderId?: ID;
  lastOrderName?: string;
  state: "enabled" | "disabled" | "invited" | "declined";
}

export interface CustomerFilters {
  search?: string;
  state?: Customer["state"];
  tag?: string;
  sort?: "name" | "email" | "orders" | "spent" | "created";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ── Promotions / Discounts ────────────────────────────
export type DiscountType =
  | "percentage"
  | "fixed_amount"
  | "free_shipping"
  | "buy_x_get_y";
export type DiscountTargetType =
  | "all"
  | "collections"
  | "products"
  | "customers";

export interface DiscountCode extends Meta {
  code: string;
  type: DiscountType;
  value: number; // % or $ amount
  minimumAmount?: number;
  minimumQuantity?: number;
  usageLimit?: number;
  usageCount: number;
  oncePerCustomer: boolean;
  appliesTo: DiscountTargetType;
  appliesToIds?: ID[];
  startsAt?: ISO8601;
  endsAt?: ISO8601;
  active: boolean;
  combinesWith: { discountCodes: boolean; shippingDiscounts: boolean };
}

export interface AutomaticDiscount extends Meta {
  title: string;
  type: DiscountType;
  value: number;
  startsAt?: ISO8601;
  endsAt?: ISO8601;
  active: boolean;
}

export interface FlashSale extends Meta {
  title: string;
  startsAt: ISO8601;
  endsAt: ISO8601;
  products: ID[];
  discount: { type: "percentage" | "fixed_amount"; value: number };
  badge?: string; // "FLASH SALE"
  active: boolean;
}

// ── Storefront Content ────────────────────────────────
export interface AnnouncementBar {
  enabled: boolean;
  text: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
}

export interface HeroSlide {
  id: ID;
  image: string;
  mobileImage?: string;
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  cta2Label?: string;
  cta2Url?: string;
  textColor?: string;
  overlay?: number; // 0-100 opacity
  position: number;
}

export interface HeroSection {
  slides: HeroSlide[];
  autoplay: boolean;
  autoplayDelay: number; // seconds
  showDots: boolean;
  showArrows: boolean;
  height: "full" | "large" | "medium" | "small";
}

export interface FeaturedCollection {
  enabled: boolean;
  title: string;
  subtitle?: string;
  collectionId: ID;
  displayCount: number;
  layout: "grid" | "carousel";
  showViewAll: boolean;
}

export interface TestimonialItem {
  id: ID;
  author: string;
  role?: string;
  avatar?: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  active: boolean;
}

export interface NewsletterSection {
  enabled: boolean;
  title: string;
  subtitle?: string;
  placeholder: string;
  buttonLabel: string;
  backgroundImage?: string;
  klaviyoListId?: string;
  mailchimpTag?: string;
}

export interface ContentPage extends Meta {
  title: string;
  handle: string;
  bodyHtml: string;
  bodyText?: string;
  published: boolean;
  templateSuffix?: string;
  seo: SEOMeta;
}

export interface BlogPost extends Meta {
  title: string;
  handle: string;
  author: string;
  bodyHtml: string;
  image?: string;
  tags: string[];
  published: boolean;
  publishedAt?: ISO8601;
  seo: SEOMeta;
}

export interface StorefrontContent {
  announcementBar: AnnouncementBar;
  hero: HeroSection;
  featuredCollections: FeaturedCollection[];
  testimonials: TestimonialItem[];
  newsletter: NewsletterSection;
  pages: ContentPage[];
  blog: BlogPost[];
}

// ── Navigation ────────────────────────────────────────
export interface NavLink {
  id: ID;
  label: string;
  url: string;
  target?: "_blank" | "_self";
  children?: NavLink[];
  position: number;
}

export interface NavMenu {
  id: ID;
  title: string; // "Main Menu", "Footer Legal"
  handle: string;
  items: NavLink[];
}

// ── SEO ───────────────────────────────────────────────
export interface GlobalSEO {
  siteName: string;
  titleTemplate: string; // "{page} | {siteName}"
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  twitterHandle?: string;
  facebookAppId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  robots: string; // robots.txt content
  structuredData?: string; // JSON-LD
}

export interface PageSEO extends Meta {
  resourceType: "product" | "collection" | "page" | "blog" | "home";
  resourceId?: ID;
  handle: string;
  seo: SEOMeta;
}

// ── Theme / Storefront Appearance ─────────────────────
export interface ColorPalette {
  primary: string;
  primaryLight?: string;
  primaryDark?: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  buttonText: string;
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  baseFontSize: number; // px
  headingWeight: string;
  lineHeight: number;
  letterSpacing?: number;
}

export interface StorefrontTheme extends Meta {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  borderRadius: number;
  spacing: number; // base -> multiply by this
  active: boolean;
  layout?: {
    containerWidth?: string;
    containerMaxWidth?: string;
    columnsDesktop?: number;
    columnsMobile?: number;
    gapDesktop?: string;
    gapMobile?: string;
    gridGap?: string;
    sectionSpacing?: string;
  };
  header?: {
    height?: string;
    backgroundColor?: string;
    textColor?: string;
    logoSize?: string | number;
    logoMaxWidth?: string;
    showSearch?: boolean;
    showCart?: boolean;
    showAccount?: boolean;
    showWishlist?: boolean;
    menuPosition?: 'top' | 'side';
    sticky?: boolean;
    transparent?: boolean;
  };
  productCard?: {
    showRating?: boolean;
    showComparePrice?: boolean;
    showVendor?: boolean;
    showSwatches?: boolean;
    imageAspectRatio?: string;
    aspectRatio?: string;
    borderStyle?: 'solid' | 'none' | 'dashed';
    borderRadius?: string;
    shadowEnabled?: boolean;
    hoverEffect?: 'zoom' | 'overlay' | 'none';
  };
}

// ── Store Settings ───────────────────────────────────
export interface ShippingZone {
  id: ID;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

export interface ShippingRate {
  id: ID;
  name: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
}

export interface TaxRate {
  id: ID;
  name: string;
  rate: number; // percentage
  countries: string[];
  regionCodes?: string[];
  includeRegions?: boolean;
}

export interface StoreSettings extends Meta {
  storeName: string;
  storeEmail: string;
  storePhone?: string;
  currency: string;
  currencyFormat: string; // "${{amount}}" or "{{amount}} $"
  language: string;
  timezone: string;
  weightUnit: "kg" | "lb";
  shippingZones: ShippingZone[];
  taxRates: TaxRate[];
  taxCalculation: "tax_included" | "tax_added";
  contactEmail: string;
  contactPhone?: string;
  supportEmail: string;
  returnAddress?: Address;
}

// ── API Response Wrapper ──────────────────────────────
export interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
