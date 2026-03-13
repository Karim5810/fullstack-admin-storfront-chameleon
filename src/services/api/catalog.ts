import {
  BlogPostSchema,
  CategorySchema,
  ProductSchema,
  SearchQuerySchema,
  ServiceSchema,
} from '../../schema';
import { supabase } from '../../supabaseClient';
import type { BlogPost, Category, Product, Service } from '../../types';
import {
  asString,
  DatabaseRow,
  fromSupabaseOrFallback,
  generateId,
  getFallbackBlogPosts,
  getFallbackCategories,
  getFallbackProducts,
  getFallbackServices,
  setStoredBlogPosts,
  setStoredCategories,
  setStoredProducts,
  setStoredServices,
  toBlogPost,
  toCategory,
  toProduct,
  toService,
} from './shared';
import { normalizeSearchText } from '../../utils/catalog';
import { categoryProductCounts, seedBlogPosts, seedProducts, seedServices } from '../../data/seed';

type ProductInput = Omit<Product, 'id' | 'createdAt'> & Partial<Pick<Product, 'id' | 'createdAt'>>;
type CategoryInput = Omit<Category, 'id'> & Partial<Pick<Category, 'id'>>;
type BlogPostInput = Omit<BlogPost, 'id'> & Partial<Pick<BlogPost, 'id'>>;
type ServiceInput = Omit<Service, 'id'> & Partial<Pick<Service, 'id'>>;

const activeOnly = <T extends { isActive?: boolean }>(items: T[]) => items.filter((item) => item.isActive !== false);

const normalizeProductInput = (input: ProductInput): Product =>
  ProductSchema.parse({
    ...input,
    id: input.id ?? generateId('product'),
    image: input.image || input.images[0] || '',
    images: input.images.length > 0 ? input.images : [input.image],
    oldPrice: input.oldPrice && input.oldPrice > input.price ? input.oldPrice : undefined,
    isNew: input.isNew ?? false,
    isHot: input.isHot ?? false,
    isSale: input.isSale ?? Boolean(input.oldPrice && input.oldPrice > input.price),
    isActive: input.isActive ?? true,
    createdAt: input.createdAt ?? new Date().toISOString(),
  });

const normalizeCategoryInput = (input: CategoryInput): Category =>
  CategorySchema.parse({
    ...input,
    id: input.id ?? generateId('category'),
    isActive: input.isActive ?? true,
  });

const normalizeBlogPostInput = (input: BlogPostInput): BlogPost =>
  BlogPostSchema.parse({
    ...input,
    id: input.id ?? generateId('blog'),
    readTime: input.readTime ?? 4,
    featured: input.featured ?? false,
    isActive: input.isActive ?? true,
  });

const normalizeServiceInput = (input: ServiceInput): Service =>
  ServiceSchema.parse({
    ...input,
    id: input.id ?? generateId('service'),
    features: input.features ?? [],
    details: input.details ?? [],
    isActive: input.isActive ?? true,
  });

const sortByNewest = <T extends { createdAt?: string; publishedAt?: string }>(items: T[]) =>
  [...items].sort((a, b) => {
    const aDate = a.createdAt ?? a.publishedAt ?? '';
    const bDate = b.createdAt ?? b.publishedAt ?? '';
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

export const catalogApi = {
  products: {
    getAll: async (): Promise<Product[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toProduct(row as DatabaseRow));
        },
        () => sortByNewest(activeOnly(getFallbackProducts())),
      ),
    getById: async (id: string): Promise<Product | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`id.eq.${id},slug.eq.${id}`)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? toProduct(data as DatabaseRow) : null;
        },
        () => activeOnly(getFallbackProducts()).find((entry) => entry.id === id || entry.slug === id) ?? null,
      ),
    getByIds: async (ids: string[]): Promise<Product[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase.from('products').select('*').in('id', ids);

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toProduct(row as DatabaseRow));
        },
        () => getFallbackProducts().filter((product) => ids.includes(product.id)),
      ),
    search: async (query: string): Promise<Product[]> => {
      const validated = SearchQuerySchema.parse({ query }).query;
      const normalizedQuery = normalizeSearchText(validated);

      return fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .or(
              [
                `title.ilike.%${validated}%`,
                `description.ilike.%${validated}%`,
                `brand.ilike.%${validated}%`,
                `slug.ilike.%${validated}%`,
              ].join(','),
            )
            .limit(48);

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toProduct(row as DatabaseRow));
        },
        () =>
          activeOnly(getFallbackProducts()).filter((product) => {
            const haystack = normalizeSearchText(
              [product.title, product.description, product.brand, product.category].join(' '),
            );

            return haystack.includes(normalizedQuery);
          }),
      );
    },
    admin: {
      listAll: async (): Promise<Product[]> =>
        fromSupabaseOrFallback(
          async () => {
            const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

            if (error) {
              throw error;
            }

            return (data ?? []).map((row) => toProduct(row as DatabaseRow));
          },
          () => sortByNewest(getFallbackProducts()),
        ),
      create: async (input: ProductInput): Promise<Product> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              title: input.title,
              description: input.description,
              price: input.price,
              old_price: input.oldPrice ?? null,
              category_slug: input.category,
              brand: input.brand,
              image: input.image,
              images: input.images,
              stock: input.stock,
              rating: input.rating,
              reviews_count: input.reviewsCount,
              is_new: input.isNew ?? false,
              is_hot: input.isHot ?? false,
              is_sale: input.isSale ?? Boolean(input.oldPrice && input.oldPrice > input.price),
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('products').insert(payload).select('*').single();

            if (error) {
              throw error;
            }

            return toProduct(data as DatabaseRow);
          },
          () => {
            const nextProduct = normalizeProductInput(input);
            const nextProducts = [nextProduct, ...getFallbackProducts().filter((entry) => entry.id !== nextProduct.id)];
            setStoredProducts(nextProducts);
            return nextProduct;
          },
        ),
      update: async (id: string, input: ProductInput): Promise<Product> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              title: input.title,
              description: input.description,
              price: input.price,
              old_price: input.oldPrice ?? null,
              category_slug: input.category,
              brand: input.brand,
              image: input.image,
              images: input.images,
              stock: input.stock,
              rating: input.rating,
              reviews_count: input.reviewsCount,
              is_new: input.isNew ?? false,
              is_hot: input.isHot ?? false,
              is_sale: input.isSale ?? Boolean(input.oldPrice && input.oldPrice > input.price),
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*').single();

            if (error) {
              throw error;
            }

            return toProduct(data as DatabaseRow);
          },
          () => {
            const existing = getFallbackProducts().find((entry) => entry.id === id);

            if (!existing) {
              throw new Error('Product not found.');
            }

            const nextProduct = normalizeProductInput({ ...existing, ...input, id: existing.id, createdAt: existing.createdAt });
            const nextProducts = [nextProduct, ...getFallbackProducts().filter((entry) => entry.id !== id)];
            setStoredProducts(nextProducts);
            return nextProduct;
          },
        ),
      delete: async (id: string): Promise<void> =>
        fromSupabaseOrFallback(
          async () => {
            const { error } = await supabase.from('products').delete().eq('id', id);

            if (error) {
              throw error;
            }
          },
          () => {
            setStoredProducts(getFallbackProducts().filter((entry) => entry.id !== id));
          },
        ),
    },
  },
  categories: {
    getAll: async (): Promise<Category[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('name');

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toCategory(row as DatabaseRow));
        },
        () => activeOnly(getFallbackCategories()).sort((a, b) => a.name.localeCompare(b.name)),
      ),
    getBySlug: async (slug: string): Promise<Category | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? toCategory(data as DatabaseRow) : null;
        },
        () => activeOnly(getFallbackCategories()).find((entry) => entry.slug === slug) ?? null,
      ),
    admin: {
      listAll: async (): Promise<Category[]> =>
        fromSupabaseOrFallback(
          async () => {
            const { data, error } = await supabase.from('categories').select('*').order('name');

            if (error) {
              throw error;
            }

            return (data ?? []).map((row) => toCategory(row as DatabaseRow));
          },
          () => getFallbackCategories().sort((a, b) => a.name.localeCompare(b.name)),
        ),
      create: async (input: CategoryInput): Promise<Category> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              name: input.name,
              icon: input.icon ?? null,
              image: input.image ?? null,
              parent_id: input.parent_id ?? null,
              description: input.description ?? null,
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('categories').insert(payload).select('*').single();

            if (error) {
              throw error;
            }

            return toCategory(data as DatabaseRow);
          },
          () => {
            const nextCategory = normalizeCategoryInput(input);
            const nextCategories = [nextCategory, ...getFallbackCategories().filter((entry) => entry.id !== nextCategory.id)];
            setStoredCategories(nextCategories);
            return nextCategory;
          },
        ),
      update: async (id: string, input: CategoryInput): Promise<Category> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              name: input.name,
              icon: input.icon ?? null,
              image: input.image ?? null,
              parent_id: input.parent_id ?? null,
              description: input.description ?? null,
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select('*').single();

            if (error) {
              throw error;
            }

            return toCategory(data as DatabaseRow);
          },
          () => {
            const existing = getFallbackCategories().find((entry) => entry.id === id);

            if (!existing) {
              throw new Error('Category not found.');
            }

            const nextCategory = normalizeCategoryInput({ ...existing, ...input, id: existing.id });
            const nextCategories = [nextCategory, ...getFallbackCategories().filter((entry) => entry.id !== id)];
            setStoredCategories(nextCategories);
            return nextCategory;
          },
        ),
      delete: async (id: string): Promise<void> =>
        fromSupabaseOrFallback(
          async () => {
            const { error } = await supabase.from('categories').delete().eq('id', id);

            if (error) {
              throw error;
            }
          },
          () => {
            setStoredCategories(getFallbackCategories().filter((entry) => entry.id !== id));
          },
        ),
    },
  },
  blog: {
    getAll: async (): Promise<BlogPost[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('is_active', true)
            .order('published_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toBlogPost(row as DatabaseRow));
        },
        () => sortByNewest(activeOnly(getFallbackBlogPosts())),
      ),
    getById: async (id: string): Promise<BlogPost | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .or(`id.eq.${id},slug.eq.${id}`)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? toBlogPost(data as DatabaseRow) : null;
        },
        () => activeOnly(getFallbackBlogPosts()).find((entry) => entry.id === id || entry.slug === id) ?? null,
      ),
    admin: {
      listAll: async (): Promise<BlogPost[]> =>
        fromSupabaseOrFallback(
          async () => {
            const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });

            if (error) {
              throw error;
            }

            return (data ?? []).map((row) => toBlogPost(row as DatabaseRow));
          },
          () => sortByNewest(getFallbackBlogPosts()),
        ),
      create: async (input: BlogPostInput): Promise<BlogPost> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              title: input.title,
              excerpt: input.excerpt,
              content: input.content,
              author: input.author,
              category: input.category,
              image: input.image,
              published_at: input.publishedAt,
              read_time: input.readTime ?? 4,
              featured: input.featured ?? false,
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('blog_posts').insert(payload).select('*').single();

            if (error) {
              throw error;
            }

            return toBlogPost(data as DatabaseRow);
          },
          () => {
            const nextPost = normalizeBlogPostInput(input);
            const nextPosts = [nextPost, ...getFallbackBlogPosts().filter((entry) => entry.id !== nextPost.id)];
            setStoredBlogPosts(nextPosts);
            return nextPost;
          },
        ),
      update: async (id: string, input: BlogPostInput): Promise<BlogPost> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              title: input.title,
              excerpt: input.excerpt,
              content: input.content,
              author: input.author,
              category: input.category,
              image: input.image,
              published_at: input.publishedAt,
              read_time: input.readTime ?? 4,
              featured: input.featured ?? false,
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('blog_posts').update(payload).eq('id', id).select('*').single();

            if (error) {
              throw error;
            }

            return toBlogPost(data as DatabaseRow);
          },
          () => {
            const existing = getFallbackBlogPosts().find((entry) => entry.id === id);

            if (!existing) {
              throw new Error('Blog post not found.');
            }

            const nextPost = normalizeBlogPostInput({ ...existing, ...input, id: existing.id });
            const nextPosts = [nextPost, ...getFallbackBlogPosts().filter((entry) => entry.id !== id)];
            setStoredBlogPosts(nextPosts);
            return nextPost;
          },
        ),
      delete: async (id: string): Promise<void> =>
        fromSupabaseOrFallback(
          async () => {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);

            if (error) {
              throw error;
            }
          },
          () => {
            setStoredBlogPosts(getFallbackBlogPosts().filter((entry) => entry.id !== id));
          },
        ),
    },
  },
  services: {
    getAll: async (): Promise<Service[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('title');

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toService(row as DatabaseRow));
        },
        () => activeOnly(getFallbackServices()).sort((a, b) => a.title.localeCompare(b.title)),
      ),
    getById: async (id: string): Promise<Service | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .or(`id.eq.${id},slug.eq.${id}`)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? toService(data as DatabaseRow) : null;
        },
        () => activeOnly(getFallbackServices()).find((entry) => entry.id === id || entry.slug === id) ?? null,
      ),
    admin: {
      listAll: async (): Promise<Service[]> =>
        fromSupabaseOrFallback(
          async () => {
            const { data, error } = await supabase.from('services').select('*').order('title');

            if (error) {
              throw error;
            }

            return (data ?? []).map((row) => toService(row as DatabaseRow));
          },
          () => getFallbackServices().sort((a, b) => a.title.localeCompare(b.title)),
        ),
      create: async (input: ServiceInput): Promise<Service> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              title: input.title,
              description: input.description,
              icon: input.icon,
              link: input.link,
              features: input.features ?? [],
              details: input.details ?? [],
              related_category: input.relatedCategory ?? null,
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('services').insert(payload).select('*').single();

            if (error) {
              throw error;
            }

            return toService(data as DatabaseRow);
          },
          () => {
            const nextService = normalizeServiceInput(input);
            const nextServices = [nextService, ...getFallbackServices().filter((entry) => entry.id !== nextService.id)];
            setStoredServices(nextServices);
            return nextService;
          },
        ),
      update: async (id: string, input: ServiceInput): Promise<Service> =>
        fromSupabaseOrFallback(
          async () => {
            const payload = {
              slug: input.slug,
              title: input.title,
              description: input.description,
              icon: input.icon,
              link: input.link,
              features: input.features ?? [],
              details: input.details ?? [],
              related_category: input.relatedCategory ?? null,
              is_active: input.isActive ?? true,
            };

            const { data, error } = await supabase.from('services').update(payload).eq('id', id).select('*').single();

            if (error) {
              throw error;
            }

            return toService(data as DatabaseRow);
          },
          () => {
            const existing = getFallbackServices().find((entry) => entry.id === id);

            if (!existing) {
              throw new Error('Service not found.');
            }

            const nextService = normalizeServiceInput({ ...existing, ...input, id: existing.id });
            const nextServices = [nextService, ...getFallbackServices().filter((entry) => entry.id !== id)];
            setStoredServices(nextServices);
            return nextService;
          },
        ),
      delete: async (id: string): Promise<void> =>
        fromSupabaseOrFallback(
          async () => {
            const { error } = await supabase.from('services').delete().eq('id', id);

            if (error) {
              throw error;
            }
          },
          () => {
            setStoredServices(getFallbackServices().filter((entry) => entry.id !== id));
          },
        ),
    },
  },
};

export const catalogMeta = {
  featuredCategory: asString(getFallbackCategories()[0]?.slug),
  categoryProductCounts,
  featuredProductSlug: asString(seedProducts[0]?.slug),
  featuredBlogSlug: asString(seedBlogPosts[0]?.slug),
  featuredServiceSlug: asString(seedServices[0]?.slug),
};
