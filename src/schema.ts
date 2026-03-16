import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['admin', 'customer']),
  phone: z.string().min(8).optional(),
  company: z.string().min(2).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(3),
  description: z.string(),
  price: z.number().nonnegative(),
  oldPrice: z.number().nonnegative().optional(),
  category: z.string().min(1),
  brand: z.string().min(1),
  image: z.string().min(1),
  images: z.array(z.string().min(1)).default([]),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5).default(0),
  reviewsCount: z.number().int().nonnegative().default(0),
  isNew: z.boolean().optional(),
  isHot: z.boolean().optional(),
  isSale: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  slug: z.string().min(1),
  icon: z.string().optional(),
  image: z.string().min(1).optional(),
  parent_id: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const AddressSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional().nullable(),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  country: z.string().min(2),
  isDefault: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CartItemSchema = z.object({
  id: z.string(),
  userId: z.string().optional().nullable(),
  productId: z.string(),
  product: ProductSchema,
  quantity: z.number().int().positive(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const WishlistItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  product: ProductSchema,
  createdAt: z.string(),
});

export const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  product: ProductSchema.optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  userId: z.string(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  subtotal: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(['cash', 'vodafone', 'instapay', 'bank']),
  items: z.array(OrderItemSchema),
  shippingAddress: AddressSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  author: z.string().min(2),
  category: z.string().min(1),
  image: z.string().min(1),
  publishedAt: z.string(),
  readTime: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const ServiceSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  icon: z.string().min(1),
  link: z.string().min(1),
  features: z.array(z.string()).optional(),
  details: z.array(z.string()).optional(),
  relatedCategory: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const SearchQuerySchema = z.object({
  query: z.string().trim().min(2),
});

export const NewsletterSchema = z.object({
  email: z.string().trim().email(),
});

export const PasswordResetRequestSchema = z.object({
  email: z.string().trim().email(),
});

export const PasswordUpdateSchema = z
  .object({
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8),
  subject: z.string().trim().min(2),
  message: z.string().trim().min(10),
});

export const QuoteRequestSchema = z.object({
  company: z.string().trim().min(2),
  contactName: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  email: z.string().trim().email(),
  activity: z.string().trim().min(2),
  orderSize: z.string().trim().min(2),
  description: z.string().trim().min(10),
});

export const B2BRegistrationSchema = z.object({
  companyName: z.string().trim().min(2),
  contactName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8),
  sector: z.string().trim().min(2),
  expectedMonthlySpend: z.string().trim().min(2),
  requirements: z.string().trim().min(10),
});

export const CheckoutSubmissionSchema = z.object({
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['cash', 'vodafone', 'instapay', 'bank']),
});
