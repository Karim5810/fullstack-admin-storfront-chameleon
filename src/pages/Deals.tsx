import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import type { Product } from '../types';

export default function Deals() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 35, seconds: 42 });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous.seconds > 0) return { ...previous, seconds: previous.seconds - 1 };
        if (previous.minutes > 0) return { ...previous, minutes: previous.minutes - 1, seconds: 59 };
        if (previous.hours > 0) return { ...previous, hours: previous.hours - 1, minutes: 59, seconds: 59 };
        if (previous.days > 0) return { ...previous, days: previous.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return previous;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadDeals = async () => {
      setIsLoading(true);
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDeals();
  }, []);

  const dealProducts = useMemo(() => {
    const saleProducts = products.filter((product) => product.isSale || product.oldPrice);
    return saleProducts.length > 0 ? saleProducts : products;
  }, [products]);

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-[rgba(255,107,0,0.1)] to-transparent border-b border-[var(--border)] py-12">
        <div className="container">
          <h1 className="text-4xl font-black text-white mb-4">عروض حصرية</h1>
          <div className="flex gap-4 items-center flex-wrap">
            {[
              { value: timeLeft.days, label: 'أيام' },
              { value: timeLeft.hours, label: 'ساعات' },
              { value: timeLeft.minutes, label: 'دقائق' },
              { value: timeLeft.seconds, label: 'ثواني' },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--o)] rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-black text-white">{String(item.value).padStart(2, '0')}</div>
                <div className="text-xs text-white font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16">
        {isLoading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-[var(--d2)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
