import { categoryProductCounts, seedBlogPosts, seedProducts, seedServices } from '../../data/seed';
import { getBlogPostSlug, getProductSlug, getServiceSlug } from '../../utils/catalog';
import { isSupabaseConfigured } from '../../supabaseClient';
import { accountsApi } from './accounts';
import { catalogApi } from './catalog';
import { commerceApi } from './commerce';
import { siteContentApi } from './siteContent';

export const api = {
  ...catalogApi,
  ...accountsApi,
  ...commerceApi,
  ...siteContentApi,
};

export const apiMeta = {
  usesSupabase: isSupabaseConfigured(),
  categoryProductCounts,
  featuredProductSlug: getProductSlug(seedProducts[0]),
  featuredBlogSlug: getBlogPostSlug(seedBlogPosts[0]),
  featuredServiceSlug: getServiceSlug(seedServices[0]),
};
