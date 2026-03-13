import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';

export default function Stats() {
  const { settings } = useSiteContent();
  const section = settings.home.statsSection;
  const items = section.items.filter((item) => item.isVisible);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!section.isVisible || items.length === 0) {
    return null;
  }

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-card" ref={statsRef}>
          <div className="stats-top">
            {section.eyebrow ? <div className="sec-label" style={{ marginBottom: '10px' }}>{section.eyebrow}</div> : null}
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.subtitle}</div>
          </div>
          <svg style={{ display: 'block', margin: '0 auto 40px', opacity: '.15' }} width="600" height="2" viewBox="0 0 600 2">
            <line x1="0" y1="1" x2="600" y2="1" stroke="#FF6B00" strokeWidth="1" strokeDasharray="6 4" />
          </svg>
          <div className="stats-grid">
            {items.map((item) => (
              <div key={item.id} className="stat-cell">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <span className="stat-num">
                  {isVisible ? item.value : 0}
                  <span className="stat-unit">{item.suffix}</span>
                </span>
                <div className="stat-lbl">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
