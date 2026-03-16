// ═══════════════════════════════════════════════════════
//  CMS Module Index
//  Central entry point for all CMS functionality
// ═══════════════════════════════════════════════════════

// API & Types
export { API, API_CONFIG } from './api';
export type { 
  Product,  ProductVariant, ProductFilters, Collection,
  Order, OrderFilters, Customer, CustomerFilters,
  DiscountCode, AutomaticDiscount, FlashSale,
  StorefrontContent, NavMenu, GlobalSEO, PageSEO,
  StorefrontTheme, StoreSettings, MediaFile,
  PaginatedResponse, ApiResponse,BlogPost,
} from './types';

// Hooks
export {
  useProducts,
  useCollections,
  useOrders,
  useCustomers,
  useMedia,
  useDiscounts,
  useFlashSales,
  useContent,
  useNavigation,
  useGlobalSEO,
  useThemes,
  useSettings,
} from './hooks';

// Pages
export { ProductsPage } from './ProductsPage';
export { OrdersPage } from './OrdersPage';
export { ContentPage } from './ContentPage';
export { CustomersPage, PromotionsPage, MediaPage, NavigationPage, SEOPage, ThemePage, SettingsPage } from './CMSPages';
export { APIDocumentationPage } from './CMSPagesExtension';

// UI Components
export * from './components/ui';
