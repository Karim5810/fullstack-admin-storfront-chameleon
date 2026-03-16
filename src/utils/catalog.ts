import type { BlogPost, Product, Service } from '../types';

export const FALLBACK_IMAGE = '/logo-192.png';

export const withFallbackImage = (images: string[], fallback: string = FALLBACK_IMAGE): string[] => {
  const filtered = images.filter((img) => img && img.trim());
  return filtered.length > 0 ? filtered : [fallback];
};


export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const ensureSlug = (value: string | undefined, fallbackValue: string) => {
  const source = value?.trim() || fallbackValue;
  const slug = slugify(source);
  return slug || slugify(fallbackValue) || fallbackValue;
};

export const getProductSlug = (product: Pick<Product, 'id' | 'slug' | 'title'>) =>
  ensureSlug(product.slug, `${product.title}-${product.id}`);

/** Use id for reliable routing; slug can have encoding/matching issues. */
export const getProductPath = (product: Pick<Product, 'id' | 'slug' | 'title'>) =>
  `/products/${product.id}`;

export const getBlogPostSlug = (post: Pick<BlogPost, 'id' | 'slug' | 'title'>) =>
  ensureSlug(post.slug, `${post.title}-${post.id}`);

export const getBlogPostPath = (post: Pick<BlogPost, 'id' | 'slug' | 'title'>) =>
  `/blog/${getBlogPostSlug(post)}`;

export const getServiceSlug = (service: Pick<Service, 'id' | 'slug' | 'title'>) =>
  ensureSlug(service.slug, `${service.title}-${service.id}`);

export const getServicePath = (service: Pick<Service, 'id' | 'slug' | 'title'>) =>
  `/services/${getServiceSlug(service)}`;

export const formatCurrency = (value: number) => `${value.toFixed(2)} ج.م`;

export const normalizeSearchText = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u064B-\u065F]/g, '')
    .toLowerCase()
    .trim();

export const matchesSearch = (text: string, search: string) =>
  normalizeSearchText(text).includes(normalizeSearchText(search));

export const filterProducts = (products: Product[], search: string) =>
  products.filter((product) => matchesSearch(product.title, search) || matchesSearch(product.description, search));

export const filterBlogPosts = (posts: BlogPost[], search: string) =>
  posts.filter((post) => matchesSearch(post.title, search) || matchesSearch(post.excerpt, search));

export const filterServices = (services: Service[], search: string) =>
  services.filter((service) => matchesSearch(service.title, search) || matchesSearch(service.description, search));
