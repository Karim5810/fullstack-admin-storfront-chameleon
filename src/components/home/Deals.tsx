import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import ProductCard from '../ProductCard';
import SmartLink from '../SmartLink';
import { useSiteContent } from '../../contexts/SiteContentContext';

interface DealsProps {
  products: Product[];
  onOpenModal: (product: Product) => void;
}

export default function Deals({ products, onOpenModal }: DealsProps) {
  const { settings } = useSiteContent();
  const section = settings.home.dealsSection;
  const [timeLeft, setTimeLeft] = useState({
    h: section.timerHours,
    m: section.timerMinutes,
    s: section.timerSeconds,
  });

  useEffect(() => {
    setTimeLeft({
      h: section.timerHours,
      m: section.timerMinutes,
      s: section.timerSeconds,
    });
  }, [section.timerHours, section.timerMinutes, section.timerSeconds]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        let { h, m, s } = previous;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
        }
        return { h, m, s };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!section.isVisible || products.length === 0) {
    return null;
  }

  return (
    <section className="deals-section" id="deals">
      <div className="container">
        <div className="deals-header-card">
          <div className="deals-info">
            {section.eyebrow ? <div className="sec-label" style={{ marginBottom: '10px' }}>{section.eyebrow}</div> : null}
            <h2>{section.title}</h2>
            <p>{section.subtitle}</p>
            {section.ctaLabel && section.ctaHref ? (
              <SmartLink href={section.ctaHref} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <circle cx="7" cy="7" r="1.5" />
                </svg>
                {section.ctaLabel}
              </SmartLink>
            ) : null}
          </div>
          <div className="countdown">
            <div className="count-block"><span className="count-num">{String(timeLeft.h).padStart(2, '0')}</span><div className="count-lbl">ساعة</div></div>
            <div className="count-sep">:</div>
            <div className="count-block"><span className="count-num">{String(timeLeft.m).padStart(2, '0')}</span><div className="count-lbl">دقيقة</div></div>
            <div className="count-sep">:</div>
            <div className="count-block"><span className="count-num">{String(timeLeft.s).padStart(2, '0')}</span><div className="count-lbl">ثانية</div></div>
          </div>
        </div>
        <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showQuickView onQuickView={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  );
}
