import React from 'react';
import type { Product } from '../types';
import { useCommerce } from '../contexts/CommerceContext';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  label?: string;
  onAdded?: () => void;
}

export default function AddToCartButton({
  product,
  className = 'add-cart',
  label = 'أضف إلى السلة',
  onAdded,
}: AddToCartButtonProps) {
  const { addToCart } = useCommerce();

  return (
    <button
      className={className}
      onClick={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await addToCart(product, 1);
        onAdded?.();
      }}
    >
      <svg viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {label}
    </button>
  );
}
