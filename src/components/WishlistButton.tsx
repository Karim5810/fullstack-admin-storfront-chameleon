import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useCommerce } from '../contexts/CommerceContext';

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export default function WishlistButton({
  product,
  className = 'prod-wish',
}: WishlistButtonProps) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useCommerce();
  const active = isInWishlist(product.id);

  return (
    <button
      className={className}
      aria-label={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      onClick={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const result = await toggleWishlist(product);
        if (result === 'auth_required') {
          navigate('/login', { state: { from: window.location.pathname + window.location.search } });
        }
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
