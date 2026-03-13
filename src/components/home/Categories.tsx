import type { Category, Product } from '../../types';
import { useSiteContent } from '../../contexts/SiteContentContext';
import SmartLink from '../SmartLink';

interface CategoriesProps {
  categories: Category[];
  products: Product[];
}

export default function Categories({ categories, products }: CategoriesProps) {
  const { settings } = useSiteContent();
  const section = settings.home.categoriesSection;
  const visibleCategories = categories.filter((category) => category.isActive !== false).slice(0, 8);

  if (!section.isVisible || visibleCategories.length === 0) {
    return null;
  }

  const productCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="cats-section" id="categories">
      <div className="container">
        <div className="sec-head">
          <div>
            {section.eyebrow ? <div className="sec-label">{section.eyebrow}</div> : null}
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.subtitle}</div>
          </div>
          {section.ctaLabel && section.ctaHref ? (
            <SmartLink href={section.ctaHref} className="view-all">
              {section.ctaLabel} <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </SmartLink>
          ) : null}
        </div>
        <div className="cats-grid">
          {visibleCategories.map((category) => (
            <SmartLink key={category.id} href={`/category/${category.slug}`} className="cat-tile">
              <div className="cat-icon-ring">
                <svg className="ring" viewBox="0 0 54 54">
                  <circle cx="27" cy="27" r="25" fill="none" stroke="rgba(255,107,0,0.2)" strokeWidth="1" strokeDasharray="4 3" />
                </svg>
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div className="cat-tile-name">{category.name}</div>
              <div className="cat-tile-count">{productCounts[category.slug] ?? 0} منتج</div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
