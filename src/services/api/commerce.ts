import {
  B2BRegistrationSchema,
  ContactMessageSchema,
  NewsletterSchema,
  QuoteRequestSchema,
} from '../../schema';
import { supabase } from '../../supabaseClient';
import type {
  AdminDashboardData,
  B2BRegistration,
  CartItem,
  ContactMessage,
  NewsletterSubscription,
  Order,
  OrderStatus,
  Product,
  QuoteRequest,
  WishlistItem,
} from '../../types';
import { accountsApi } from './accounts';
import { catalogApi } from './catalog';
import {
  asString,
  DatabaseRow,
  enrichOrderItems,
  fromSupabaseOrFallback,
  generateId,
  generateOrderNumber,
  getAllFallbackOrders,
  getStoredB2BRegistrations,
  getStoredCartItems,
  getStoredContactMessages,
  getStoredNewsletterSubscriptions,
  getStoredOrders,
  getStoredQuoteRequests,
  getStoredWishlistItems,
  mergeUniqueById,
  setStoredB2BRegistrations,
  setStoredCartItems,
  setStoredContactMessages,
  setStoredNewsletterSubscriptions,
  setStoredOrders,
  setStoredQuoteRequests,
  setStoredWishlistItems,
  toB2BRegistration,
  toCartItem,
  toContactMessage,
  toNewsletterSubscription,
  toOrder,
  toQuoteRequest,
  toWishlistItem,
} from './shared';

export const commerceApi = {
  cart: {
    getByUserId: async (userId?: string | null): Promise<CartItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          if (!userId) {
            return getStoredCartItems();
          }

          const { data, error } = await supabase
            .from('cart_items')
            .select('id, user_id, product_id, quantity, created_at, updated_at, product:products(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toCartItem(row as DatabaseRow));
        },
        () => getStoredCartItems(userId),
      ),
    add: async (product: Product, quantity = 1, userId?: string | null): Promise<CartItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          if (!userId) {
            const currentItems = getStoredCartItems();
            const existing = currentItems.find((item) => item.productId === product.id);
            const nextItems = existing
              ? currentItems.map((item) =>
                  item.productId === product.id
                    ? { ...item, quantity: item.quantity + quantity, updatedAt: new Date().toISOString() }
                    : item,
                )
              : [
                  {
                    id: generateId('cart'),
                    userId: null,
                    productId: product.id,
                    product,
                    quantity,
                    createdAt: new Date().toISOString(),
                  },
                  ...currentItems,
                ];
            setStoredCartItems(nextItems);
            return nextItems;
          }

          const currentItems = await commerceApi.cart.getByUserId(userId);
          const existing = currentItems.find((item) => item.productId === product.id);
          const nextQuantity = (existing?.quantity ?? 0) + quantity;

          const { error } = await supabase.from('cart_items').upsert(
            {
              id: existing?.id,
              user_id: userId,
              product_id: product.id,
              quantity: nextQuantity,
            },
            { onConflict: 'user_id,product_id' },
          );

          if (error) {
            throw error;
          }

          return commerceApi.cart.getByUserId(userId);
        },
        async () => {
          const currentItems = getStoredCartItems(userId);
          const existing = currentItems.find((item) => item.productId === product.id);
          const nextItems = existing
            ? currentItems.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity, updatedAt: new Date().toISOString() }
                  : item,
              )
            : [
                {
                  id: generateId('cart'),
                  userId: userId ?? null,
                  productId: product.id,
                  product,
                  quantity,
                  createdAt: new Date().toISOString(),
                },
                ...currentItems,
              ];
          setStoredCartItems(nextItems, userId);
          return nextItems;
        },
      ),
    updateQuantity: async (productId: string, quantity: number, userId?: string | null): Promise<CartItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          if (!userId) {
            const currentItems = getStoredCartItems();
            const nextItems =
              quantity <= 0
                ? currentItems.filter((item) => item.productId !== productId)
                : currentItems.map((item) =>
                    item.productId === productId
                      ? { ...item, quantity, updatedAt: new Date().toISOString() }
                      : item,
                  );
            setStoredCartItems(nextItems);
            return nextItems;
          }

          if (quantity <= 0) {
            await commerceApi.cart.remove(productId, userId);
            return commerceApi.cart.getByUserId(userId);
          }

          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId);

          if (error) {
            throw error;
          }

          return commerceApi.cart.getByUserId(userId);
        },
        async () => {
          const currentItems = getStoredCartItems(userId);
          const nextItems =
            quantity <= 0
              ? currentItems.filter((item) => item.productId !== productId)
              : currentItems.map((item) =>
                  item.productId === productId
                    ? { ...item, quantity, updatedAt: new Date().toISOString() }
                    : item,
                );
          setStoredCartItems(nextItems, userId);
          return nextItems;
        },
      ),
    remove: async (productId: string, userId?: string | null): Promise<CartItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          if (!userId) {
            const nextItems = getStoredCartItems().filter((item) => item.productId !== productId);
            setStoredCartItems(nextItems);
            return nextItems;
          }

          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

          if (error) {
            throw error;
          }

          return commerceApi.cart.getByUserId(userId);
        },
        async () => {
          const nextItems = getStoredCartItems(userId).filter((item) => item.productId !== productId);
          setStoredCartItems(nextItems, userId);
          return nextItems;
        },
      ),
    clear: async (userId?: string | null): Promise<void> =>
      fromSupabaseOrFallback(
        async () => {
          if (!userId) {
            setStoredCartItems([]);
            return;
          }

          const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);

          if (error) {
            throw error;
          }
        },
        () => {
          setStoredCartItems([], userId);
        },
      ),
    mergeGuestCart: async (userId: string): Promise<CartItem[]> => {
      const guestItems = getStoredCartItems();

      if (guestItems.length === 0) {
        return commerceApi.cart.getByUserId(userId);
      }

      let nextItems = await commerceApi.cart.getByUserId(userId);

      for (const item of guestItems) {
        nextItems = await commerceApi.cart.add(item.product, item.quantity, userId);
      }

      setStoredCartItems([]);
      return nextItems;
    },
  },
  wishlist: {
    getByUserId: async (userId: string): Promise<WishlistItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('id, user_id, product_id, created_at, product:products(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toWishlistItem(row as DatabaseRow));
        },
        () => getStoredWishlistItems(userId),
      ),
    add: async (product: Product, userId: string): Promise<WishlistItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { error } = await supabase.from('wishlist_items').upsert(
            { user_id: userId, product_id: product.id },
            { onConflict: 'user_id,product_id' },
          );

          if (error) {
            throw error;
          }

          return commerceApi.wishlist.getByUserId(userId);
        },
        async () => {
          const currentItems = getStoredWishlistItems(userId);
          if (currentItems.some((item) => item.productId === product.id)) {
            return currentItems;
          }

          const nextItems = [
            {
              id: generateId('wish'),
              userId,
              productId: product.id,
              product,
              createdAt: new Date().toISOString(),
            },
            ...currentItems,
          ];
          setStoredWishlistItems(nextItems, userId);
          return nextItems;
        },
      ),
    remove: async (productId: string, userId: string): Promise<WishlistItem[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

          if (error) {
            throw error;
          }

          return commerceApi.wishlist.getByUserId(userId);
        },
        async () => {
          const nextItems = getStoredWishlistItems(userId).filter((item) => item.productId !== productId);
          setStoredWishlistItems(nextItems, userId);
          return nextItems;
        },
      ),
    toggle: async (product: Product, userId: string): Promise<WishlistItem[]> => {
      const currentItems = await commerceApi.wishlist.getByUserId(userId);
      const exists = currentItems.some((item) => item.productId === product.id);
      return exists ? commerceApi.wishlist.remove(product.id, userId) : commerceApi.wishlist.add(product, userId);
    },
  },
  orders: {
    getAll: async (): Promise<Order[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => enrichOrderItems(toOrder(row as DatabaseRow)));
        },
        () => getAllFallbackOrders().map(enrichOrderItems),
      ),
    getByUserId: async (userId: string): Promise<Order[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => enrichOrderItems(toOrder(row as DatabaseRow)));
        },
        () => getAllFallbackOrders().filter((order) => order.userId === userId).map(enrichOrderItems),
      ),
    getById: async (id: string): Promise<Order | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .or(`id.eq.${id},order_number.eq.${id}`)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? enrichOrderItems(toOrder(data as DatabaseRow)) : null;
        },
        () => {
          const order = getAllFallbackOrders().find((entry) => entry.id === id || entry.orderNumber === id);
          return order ? enrichOrderItems(order) : null;
        },
      ),
    create: async (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> =>
      fromSupabaseOrFallback(
        async () => {
          const payload = {
            order_number: generateOrderNumber(),
            user_id: order.userId,
            status: order.status,
            subtotal: order.subtotal,
            shipping_fee: order.shippingFee,
            total: order.total,
            payment_method: order.paymentMethod,
            items: order.items,
            shipping_address: order.shippingAddress,
          };

          const { data, error } = await supabase.from('orders').insert(payload).select('*').single();

          if (error) {
            throw error;
          }

          return enrichOrderItems(toOrder(data as DatabaseRow));
        },
        async () => {
          const nextOrder: Order = {
            ...order,
            id: generateId('order'),
            orderNumber: generateOrderNumber(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setStoredOrders([nextOrder, ...getStoredOrders()]);
          return enrichOrderItems(nextOrder);
        },
      ),
    updateStatus: async (id: string, status: OrderStatus): Promise<Order> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select('*')
            .single();

          if (error) {
            throw error;
          }

          return enrichOrderItems(toOrder(data as DatabaseRow));
        },
        async () => {
          const currentOrders = getStoredOrders();
          const existing = currentOrders.find((order) => order.id === id) ?? getAllFallbackOrders().find((order) => order.id === id);

          if (!existing) {
            throw new Error('Order not found.');
          }

          const nextOrder = { ...existing, status, updatedAt: new Date().toISOString() };
          setStoredOrders([nextOrder, ...currentOrders.filter((order) => order.id !== id)]);
          return enrichOrderItems(nextOrder);
        },
      ),
  },
  contact: {
    getAll: async (): Promise<ContactMessage[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toContactMessage(row as DatabaseRow));
        },
        () => getStoredContactMessages(),
      ),
    create: async (input: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> =>
      fromSupabaseOrFallback(
        async () => {
          const validated = ContactMessageSchema.parse(input);
          const payload = {
            user_id: input.userId ?? null,
            name: validated.name,
            email: validated.email,
            phone: validated.phone,
            subject: validated.subject,
            message: validated.message,
          };
          const { data, error } = await supabase.from('contact_messages').insert(payload).select('*').single();

          if (error) {
            throw error;
          }

          return toContactMessage(data as DatabaseRow);
        },
        async () => {
          const validated = ContactMessageSchema.parse(input);
          const nextMessage: ContactMessage = {
            id: generateId('contact'),
            userId: input.userId,
            ...validated,
            status: 'new',
            createdAt: new Date().toISOString(),
          };
          setStoredContactMessages([nextMessage, ...getStoredContactMessages()]);
          return nextMessage;
        },
      ),
  },
  quote: {
    getAll: async (): Promise<QuoteRequest[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('quote_requests')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toQuoteRequest(row as DatabaseRow));
        },
        () => getStoredQuoteRequests(),
      ),
    create: async (input: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>): Promise<QuoteRequest> =>
      fromSupabaseOrFallback(
        async () => {
          const validated = QuoteRequestSchema.parse(input);
          const payload = {
            user_id: input.userId ?? null,
            company: validated.company,
            contact_name: validated.contactName,
            phone: validated.phone,
            email: validated.email,
            activity: validated.activity,
            order_size: validated.orderSize,
            description: validated.description,
          };
          const { data, error } = await supabase.from('quote_requests').insert(payload).select('*').single();

          if (error) {
            throw error;
          }

          return toQuoteRequest(data as DatabaseRow);
        },
        async () => {
          const validated = QuoteRequestSchema.parse(input);
          const nextRequest: QuoteRequest = {
            id: generateId('quote'),
            userId: input.userId,
            ...validated,
            status: 'new',
            createdAt: new Date().toISOString(),
          };
          setStoredQuoteRequests([nextRequest, ...getStoredQuoteRequests()]);
          return nextRequest;
        },
      ),
  },
  newsletter: {
    getAll: async (): Promise<NewsletterSubscription[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toNewsletterSubscription(row as DatabaseRow));
        },
        () => getStoredNewsletterSubscriptions(),
      ),
    subscribe: async (email: string): Promise<NewsletterSubscription> =>
      fromSupabaseOrFallback(
        async () => {
          const validatedEmail = NewsletterSchema.parse({ email }).email;
          const { data, error } = await supabase
            .from('newsletter_subscribers')
            .upsert({ email: validatedEmail }, { onConflict: 'email' })
            .select('*')
            .single();

          if (error) {
            throw error;
          }

          return toNewsletterSubscription(data as DatabaseRow);
        },
        async () => {
          const validatedEmail = NewsletterSchema.parse({ email }).email;
          const existing = getStoredNewsletterSubscriptions().find((entry) => entry.email === validatedEmail);

          if (existing) {
            return existing;
          }

          const nextEntry = {
            id: generateId('newsletter'),
            email: validatedEmail,
            createdAt: new Date().toISOString(),
          };
          setStoredNewsletterSubscriptions([nextEntry, ...getStoredNewsletterSubscriptions()]);
          return nextEntry;
        },
      ),
  },
  b2b: {
    getAll: async (): Promise<B2BRegistration[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('b2b_registrations')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toB2BRegistration(row as DatabaseRow));
        },
        () => getStoredB2BRegistrations(),
      ),
    register: async (input: Omit<B2BRegistration, 'id' | 'status' | 'createdAt'>): Promise<B2BRegistration> =>
      fromSupabaseOrFallback(
        async () => {
          const validated = B2BRegistrationSchema.parse(input);
          const payload = {
            user_id: input.userId ?? null,
            company_name: validated.companyName,
            contact_name: validated.contactName,
            email: validated.email,
            phone: validated.phone,
            sector: validated.sector,
            expected_monthly_spend: validated.expectedMonthlySpend,
            requirements: validated.requirements,
          };
          const { data, error } = await supabase.from('b2b_registrations').insert(payload).select('*').single();

          if (error) {
            throw error;
          }

          return toB2BRegistration(data as DatabaseRow);
        },
        async () => {
          const validated = B2BRegistrationSchema.parse(input);
          const nextEntry: B2BRegistration = {
            id: generateId('b2b'),
            userId: input.userId,
            ...validated,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          setStoredB2BRegistrations([nextEntry, ...getStoredB2BRegistrations()]);
          return nextEntry;
        },
      ),
  },
  admin: {
    getDashboard: async (): Promise<AdminDashboardData> => {
      const [orders, products, profiles, quotes, b2bRegistrations, newsletterSubscriptions] =
        await Promise.all([
          commerceApi.orders.getAll(),
          catalogApi.products.getAll(),
          accountsApi.profiles.getAll(),
          commerceApi.quote.getAll(),
          commerceApi.b2b.getAll(),
          commerceApi.newsletter.getAll(),
        ]);

      return {
        metrics: {
          totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
          orderCount: orders.length,
          customerCount: profiles.length,
          quoteCount: quotes.length,
          b2bLeadCount: b2bRegistrations.length,
          newsletterCount: newsletterSubscriptions.length,
        },
        recentOrders: orders.slice(0, 10),
        recentQuotes: quotes.slice(0, 8),
        recentB2BRegistrations: b2bRegistrations.slice(0, 8),
        lowStockProducts: [...products].sort((a, b) => a.stock - b.stock).slice(0, 8),
        customers: profiles.slice(0, 12),
      };
    },
  },
};
