import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatCurrency, getProductPath } from '../utils/catalog';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  infoClassName?: string;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  className,
  imageClassName,
  infoClassName,
  showQuickView = false,
  onQuickView,
}: ProductCardProps) {
  return (
    <div className={['prod-card', className].filter(Boolean).join(' ')}>
      <Link to={getProductPath(product)} className={['prod-img', imageClassName].filter(Boolean).join(' ')}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 bg-white"
          referrerPolicy="no-referrer"
        />
        {(product.isHot || product.isNew || product.isSale) && (
          <div className="prod-badges">
            {product.isHot && <span className="pd-badge pd-hot">ساخن</span>}
            {product.isNew && <span className="pd-badge pd-new">جديد</span>}
            {product.isSale && <span className="pd-badge pd-sale">عرض</span>}
          </div>
        )}
        <WishlistButton product={product} />
      </Link>

      <div className={['prod-info', infoClassName].filter(Boolean).join(' ')}>
        <div className="prod-brand">{product.brand}</div>
        <Link to={getProductPath(product)} className="prod-name block" title={product.title}>
          {product.title}
        </Link>

        <div className="prod-stars">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg
                key={`${product.id}-star-${index}`}
                viewBox="0 0 24 24"
                fill={index < Math.floor(product.rating) ? 'currentColor' : 'none'}
                stroke="currentColor"
              >
                <polygon points="12 2 15.09 10.26 23 10.27 17 16.14 19.09 24.41 12 18.54 4.91 24.41 6.99 16.14 1 10.27 8.91 10.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="stars-count">({product.reviewsCount})</span>
        </div>

        <div className="prod-price">
          <span className="p-main">{formatCurrency(product.price)}</span>
          {product.oldPrice && <span className="p-old">{formatCurrency(product.oldPrice)}</span>}
        </div>

        <div className="prod-footer">
          <AddToCartButton product={product} className="add-cart" />
          {showQuickView && onQuickView ? (
            <button
              type="button"
              className="qview"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onQuickView(product);
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
