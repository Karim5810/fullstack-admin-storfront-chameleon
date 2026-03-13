import type { BlogPost, Product, Service } from '../types';

export const FALLBACK_IMAGE = '/icon-192.png';

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

export const getProductPath = (product: Pick<Product, 'id' | 'slug' | 'title'>) =>
  `/products/${getProductSlug(product)}`;

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

export const withFallbackImage = (images: string[]) => {
  const candidates = images.filter(Boolean);
  return candidates.length > 0 ? candidates : [FALLBACK_IMAGE];
};
