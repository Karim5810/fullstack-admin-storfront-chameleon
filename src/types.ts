export type UserRole = 'admin' | 'customer';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'vodafone' | 'instapay' | 'bank';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  company?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  isActive?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parent_id?: string;
  description?: string;
  isActive?: boolean;
}

export interface Address {
  id?: string;
  userId?: string | null;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  userId?: string | null;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime?: number;
  featured?: boolean;
  isActive?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  features?: string[];
  details?: string[];
  relatedCategory?: string;
  isActive?: boolean;
}

export interface QuoteRequest {
  id: string;
  userId?: string | null;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  activity: string;
  orderSize: string;
  description: string;
  status: 'new' | 'reviewing' | 'quoted' | 'closed';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'open' | 'resolved';
  createdAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  createdAt: string;
}

export interface B2BRegistration {
  id: string;
  userId?: string | null;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  sector: string;
  expectedMonthlySpend: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminDashboardMetrics {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
  quoteCount: number;
  b2bLeadCount: number;
  newsletterCount: number;
}

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  recentOrders: Order[];
  recentQuotes: QuoteRequest[];
  recentB2BRegistrations: B2BRegistration[];
  lowStockProducts: Product[];
  customers: User[];
}

export interface SiteLink {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
  badge?: string;
}

export interface SiteFeatureItem {
  id: string;
  title: string;
  subtitle: string;
  isVisible: boolean;
}

export interface SiteSocialLink extends SiteLink {}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  isVisible: boolean;
}

export interface PromoCard {
  id: string;
  size: 'main' | 'small';
  theme: 'orange' | 'green' | 'blue' | 'gold' | 'red';
  tag: string;
  title: string;
  subtitle?: string;
  href: string;
  isVisible: boolean;
}

export interface BrandItem {
  id: string;
  name: string;
  isVisible: boolean;
}

export interface CertificateItem {
  id: string;
  name: string;
  description: string;
  theme: 'gold' | 'blue' | 'green' | 'orange';
  isVisible: boolean;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
}

export interface SectionCopy {
  isVisible: boolean;
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface TopbarSettings {
  isVisible: boolean;
  location: string;
  phone: string;
  email: string;
  contactLabel: string;
  contactHref: string;
  socialLinks: SiteSocialLink[];
  primaryLanguageLabel: string;
  secondaryLanguageLabel: string;
}

export interface HeaderSettings {
  logoTitle: string;
  logoSubtitle: string;
  searchPlaceholder: string;
  allCategoriesLabel: string;
  searchButtonLabel: string;
  accountLabel: string;
  ordersLabel: string;
  wishlistLabel: string;
  cartLabel: string;
  loginLabel: string;
  registerLabel: string;
  logoutLabel: string;
  adminLabel: string;
  welcomePrefix: string;
}

export interface NavbarSettings {
  allCategoriesLabel: string;
  catalogLinkLabel: string;
  navItems: SiteLink[];
  ctaLabel: string;
  ctaHref: string;
  dealsBadgeLabel: string;
  mobileMenuTitle: string;
  categoriesMenuTitle: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: SiteLink[];
  isVisible: boolean;
}

export interface FooterContactItem {
  id: string;
  label: string;
  value: string;
  href?: string;
  isVisible: boolean;
}

export interface FooterSettings {
  brandDescription: string;
  socialLinks: SiteSocialLink[];
  columns: FooterColumn[];
  contactItems: FooterContactItem[];
  bottomText: string;
  policyLinks: SiteLink[];
  paymentMethods: string[];
}

export interface HomeHeroSettings {
  isVisible: boolean;
  autoRotateMs: number;
  slides: HeroSlide[];
}

export interface HomeTrustStripSettings {
  isVisible: boolean;
  items: SiteFeatureItem[];
}

export interface HomePromoGridSettings {
  isVisible: boolean;
  cards: PromoCard[];
}

export interface HomeBrandsSettings extends SectionCopy {
  items: BrandItem[];
}

export interface HomeCertificatesSettings extends SectionCopy {
  items: CertificateItem[];
}

export interface HomeStatsSettings extends SectionCopy {
  items: StatItem[];
}

export interface HomeDealsSettings extends SectionCopy {
  timerHours: number;
  timerMinutes: number;
  timerSeconds: number;
}

export interface HomeNewsletterSettings extends SectionCopy {
  placeholder: string;
  submitLabel: string;
  loadingLabel: string;
  successLabel: string;
  errorLabel: string;
  note: string;
}

export interface HomeAppSettings extends SectionCopy {
  body: string;
  primaryStoreLabel: string;
  primaryStoreHref: string;
  secondaryStoreLabel: string;
  secondaryStoreHref: string;
}

export interface HomeContentSettings {
  hero: HomeHeroSettings;
  trustStrip: HomeTrustStripSettings;
  promoGrid: HomePromoGridSettings;
  categoriesSection: SectionCopy;
  productsSection: SectionCopy;
  servicesSection: SectionCopy;
  brandsSection: HomeBrandsSettings;
  dealsSection: HomeDealsSettings;
  certsSection: HomeCertificatesSettings;
  statsSection: HomeStatsSettings;
  blogSection: SectionCopy;
  newsletterSection: HomeNewsletterSettings;
  appSection: HomeAppSettings;
}

export interface SiteSettings {
  id: string;
  topbar: TopbarSettings;
  header: HeaderSettings;
  navbar: NavbarSettings;
  home: HomeContentSettings;
  footer: FooterSettings;
  updatedAt: string;
}
