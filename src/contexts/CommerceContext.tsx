import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
import type { CartItem, Product, WishlistItem } from '../types';

type WishlistActionResult = 'added' | 'removed' | 'auth_required';

interface CommerceContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<WishlistActionResult>;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveWishlistToCart: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  reload: () => Promise<void>;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCommerceState = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (user?.id) {
        await api.cart.mergeGuestCart(user.id);
        const [nextCartItems, nextWishlistItems] = await Promise.all([
          api.cart.getByUserId(user.id),
          api.wishlist.getByUserId(user.id),
        ]);
        setCartItems(nextCartItems);
        setWishlistItems(nextWishlistItems);
        return;
      }

      const nextCartItems = await api.cart.getByUserId();
      setCartItems(nextCartItems);
      setWishlistItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load commerce state.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCommerceState();
  }, [user?.id]);

  const addToCart = async (product: Product, quantity = 1) => {
    setError(null);
    const nextCartItems = await api.cart.add(product, quantity, user?.id);
    setCartItems(nextCartItems);
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    setError(null);
    const nextCartItems = await api.cart.updateQuantity(productId, quantity, user?.id);
    setCartItems(nextCartItems);
  };

  const removeFromCart = async (productId: string) => {
    setError(null);
    const nextCartItems = await api.cart.remove(productId, user?.id);
    setCartItems(nextCartItems);
  };

  const clearCart = async () => {
    setError(null);
    await api.cart.clear(user?.id);
    setCartItems([]);
  };

  const toggleWishlist = async (product: Product): Promise<WishlistActionResult> => {
    if (!user?.id) {
      return 'auth_required';
    }

    setError(null);
    const isExisting = wishlistItems.some((item) => item.productId === product.id);
    const nextWishlistItems = await api.wishlist.toggle(product, user.id);
    setWishlistItems(nextWishlistItems);
    return isExisting ? 'removed' : 'added';
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user?.id) {
      return;
    }

    setError(null);
    const nextWishlistItems = await api.wishlist.remove(productId, user.id);
    setWishlistItems(nextWishlistItems);
  };

  const moveWishlistToCart = async (productId: string) => {
    const wishlistEntry = wishlistItems.find((item) => item.productId === productId);

    if (!wishlistEntry) {
      return;
    }

    await addToCart(wishlistEntry.product, 1);
    await removeFromWishlist(productId);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cartItems.length > 0 ? 50 : 0;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <CommerceContext.Provider
      value={{
        cartItems,
        wishlistItems,
        isLoading,
        error,
        cartCount,
        wishlistCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        moveWishlistToCart,
        isInWishlist: (productId) => wishlistItems.some((item) => item.productId === productId),
        reload: loadCommerceState,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }

  return context;
};
