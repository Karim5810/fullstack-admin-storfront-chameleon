import React from 'react';
import { Link } from 'react-router-dom';
import { useCommerce } from '../contexts/CommerceContext';
import { formatCurrency, getProductPath } from '../utils/catalog';

export default function Cart() {
  const {
    cartItems,
    cartSubtotal,
    shippingFee,
    cartTotal,
    isLoading,
    error,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useCommerce();

  return (
    <div className="page-enter">
      <div className="bg-(--d2) border-b border-(--border) py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-(--o)">
              الرئيسية
            </Link>
            <span className="mx-2 text-(--muted)">/</span>
            <span className="text-(--chrome)">سلة المشتريات</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 rounded-2xl bg-(--d2) animate-pulse" />
              ))}
            </div>
            <div className="h-80 rounded-2xl bg-(--d2) animate-pulse" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-(--d2) border border-(--border) rounded-xl p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1 className="text-2xl font-bold text-white mb-2">سلة المشتريات فارغة</h1>
            <p className="text-(--muted2) mb-6">ابدأ بإضافة المنتجات التي تحتاجها للموقع أو المصنع.</p>
            <Link to="/products" className="btn-fire inline-flex">
              متابعة التسوق
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <h1 className="text-2xl font-bold text-white">سلة المشتريات</h1>
                <button type="button" onClick={() => void clearCart()} className="btn-ghost">
                  تفريغ السلة
                </button>
              </div>

              {error ? (
                <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="bg-(--d2) border border-(--border) rounded-xl overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-(--border) p-6 flex gap-6 last:border-b-0 flex-col sm:flex-row"
                  >
                    <Link
                      to={getProductPath(item.product)}
                      className="w-24 h-24 bg-(--d3) rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-contain p-3"
                        referrerPolicy="no-referrer"
                      />
                    </Link>

                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <p className="text-xs text-(--muted) uppercase mb-1">{item.product.brand}</p>
                          <Link to={getProductPath(item.product)} className="text-[0.95rem] font-bold text-white">
                            {item.product.title}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => void removeFromCart(item.productId)}
                          className="text-(--muted2) hover:text-(--o) transition-colors"
                          aria-label="إزالة المنتج"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-(--d3) rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => void updateCartQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-(--muted2) hover:text-(--o)"
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm text-(--chrome)">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => void updateCartQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-(--muted2) hover:text-(--o)"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-(--o)">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                          {item.product.oldPrice ? (
                            <p className="text-xs text-(--muted) line-through">
                              {formatCurrency(item.product.oldPrice * item.quantity)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-(--d2) border border-(--border) rounded-xl p-6 sticky top-[200px]">
                <h2 className="text-lg font-bold text-white mb-4">ملخص الطلب</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-(--border)">
                  <div className="flex justify-between text-sm">
                    <span className="text-(--muted2)">المجموع الفرعي</span>
                    <span className="text-(--chrome)">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-(--muted2)">الشحن</span>
                    <span className="text-(--chrome)">{formatCurrency(shippingFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-(--chrome)">الإجمالي</span>
                  <span className="text-2xl font-black text-(--o)">{formatCurrency(cartTotal)}</span>
                </div>

                <Link to="/checkout" className="btn-fire w-full inline-flex justify-center mb-3">
                  إتمام الشراء
                </Link>
                <Link to="/products" className="btn-ghost w-full inline-flex justify-center">
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
