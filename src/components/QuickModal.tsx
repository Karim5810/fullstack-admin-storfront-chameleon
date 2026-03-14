import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatCurrency, getProductPath } from '../utils/catalog';
import { useCommerce } from '../contexts/CommerceContext';
import WishlistButton from './WishlistButton';

interface QuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickModal({ isOpen, onClose, product }: QuickModalProps) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCommerce();

  if (!isOpen || !product) {
    return null;
  }

  const changeQty = (delta: number) => {
    setQty((current) => Math.max(1, current + delta));
  };

  return (
    <div className="modal-bg on" onClick={(event) => (event.target === event.currentTarget ? onClose() : undefined)}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="modal-grid">
          <div className="modal-img">
            <img src={product.image} alt={product.title} className="w-full h-full object-contain p-6" referrerPolicy="no-referrer" />
          </div>
          <div className="modal-info">
            <div style={{ fontSize: '.7rem', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.8px' }}>
              {product.brand} | {product.category}
            </div>
            <h2>{product.title}</h2>
            <div className="prod-stars" style={{ margin: '10px 0' }}>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={`${product.id}-star-${index}`}
                    viewBox="0 0 24 24"
                    fill={index < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="stars-count">({product.reviewsCount})</span>
            </div>
            <div className="prod-price">
              <span className="p-main" style={{ fontSize: '1.4rem' }}>{formatCurrency(product.price)}</span>
              {product.oldPrice ? <span className="p-old">{formatCurrency(product.oldPrice)}</span> : null}
            </div>
            <p style={{ fontSize: '.82rem', color: 'var(--muted2)', lineHeight: '1.75', margin: '12px 0' }}>
              {product.description}
            </p>
            <div className="modal-qty">
              <button className="qty-btn" onClick={() => changeQty(-1)}>−</button>
              <input className="qty-val" type="number" value={qty} readOnly />
              <button className="qty-btn" onClick={() => changeQty(1)}>+</button>
              <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
                {product.stock > 0 ? `${product.stock} متاح` : 'غير متاح حاليا'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="add-cart"
                style={{ flex: 1, padding: '13px', fontSize: '.9rem' }}
                onClick={async () => {
                  await addToCart(product, qty);
                  onClose();
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
                أضف للسلة
              </button>
              <WishlistButton product={product} className="btn-ghost" />
            </div>
            <div className="modal-meta">
              <span>
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                توصيل سريع حسب المدينة
              </span>
              <span>
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                جودة معتمدة للتشغيل الصناعي
              </span>
            </div>
            <Link to={getProductPath(product)} className="text-(--o) font-semibold text-sm inline-flex mt-4">
              عرض صفحة المنتج
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
