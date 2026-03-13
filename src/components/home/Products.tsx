import { useMemo, useState } from 'react';
import type { Product } from '../../types';
import ProductCard from '../ProductCard';
import SmartLink from '../SmartLink';
import { useSiteContent } from '../../contexts/SiteContentContext';

interface ProductsProps {
  products: Product[];
  onOpenModal: (product: Product) => void;
}

const tabs = ['الأكثر مبيعاً', 'جديد في المخزون', 'معدات السلامة', 'مكافحة الحرائق', 'أدوات صناعية', 'عروض خاصة'] as const;

export default function Products({ products, onOpenModal }: ProductsProps) {
  const { settings } = useSiteContent();
  const section = settings.home.productsSection;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('الأكثر مبيعاً');

  const displayProducts = useMemo(() => {
    const candidates = (() => {
      switch (activeTab) {
        case 'جديد في المخزون':
          return products.filter((product) => product.isNew);
        case 'معدات السلامة':
          return products.filter((product) => product.category === 'safety');
        case 'مكافحة الحرائق':
          return products.filter((product) => product.category === 'fire');
        case 'أدوات صناعية':
          return products.filter((product) => product.category === 'tools');
        case 'عروض خاصة':
          return products.filter((product) => product.isSale || product.oldPrice);
        default:
          return [...products].sort((a, b) => b.reviewsCount - a.reviewsCount);
      }
    })();

    return (candidates.length > 0 ? candidates : products).slice(0, 8);
  }, [activeTab, products]);

  if (!section.isVisible || products.length === 0) {
    return null;
  }

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="sec-head">
          <div>
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.subtitle}</div>
          </div>
          {section.ctaLabel && section.ctaHref ? (
            <SmartLink href={section.ctaHref} className="view-all">
              {section.ctaLabel} <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </SmartLink>
          ) : null}
        </div>
        <div className="prod-tabs">
          {tabs.map((tab) => (
            <button key={tab} className={`p-tab ${activeTab === tab ? 'on' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              className={index === 0 ? 'wide' : undefined}
              showQuickView
              onQuickView={onOpenModal}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
