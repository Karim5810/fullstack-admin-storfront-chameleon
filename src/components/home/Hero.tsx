import { useEffect, useState } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import SmartLink from '../SmartLink';

function HeroVisual({ index }: { index: number }) {
  if (index % 3 === 0) {
    return (
      <svg width="500" height="500" viewBox="0 0 500 500">
        <polygon points="250,20 480,130 480,370 250,480 20,370 20,130" stroke="#FF6B00" strokeWidth="1" fill="none" />
        <polygon points="250,60 440,155 440,345 250,440 60,345 60,155" stroke="#FF6B00" strokeWidth=".5" fill="none" />
        <polygon points="250,100 400,180 400,320 250,400 100,320 100,180" stroke="#FF6B00" strokeWidth=".3" fill="none" />
        <text x="250" y="270" textAnchor="middle" fontFamily="Tajawal" fontSize="120" fontWeight="900" fill="#FF6B00">
          ⚑
        </text>
      </svg>
    );
  }

  if (index % 3 === 1) {
    return (
      <svg width="500" height="500" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="220" stroke="#FF6B00" strokeWidth="1" fill="none" />
        <circle cx="250" cy="250" r="170" stroke="#FF6B00" strokeWidth=".5" fill="none" strokeDasharray="8 4" />
        <text x="250" y="290" textAnchor="middle" fontFamily="Tajawal" fontSize="150" fontWeight="900" fill="#FF6B00">
          ⛯
        </text>
      </svg>
    );
  }

  return (
    <svg width="500" height="500" viewBox="0 0 500 500">
      <rect x="80" y="80" width="340" height="340" rx="40" stroke="#FF6B00" strokeWidth="1" fill="none" />
      <rect x="120" y="120" width="260" height="260" rx="28" stroke="#FF6B00" strokeWidth=".5" fill="none" strokeDasharray="6 3" />
      <text x="250" y="290" textAnchor="middle" fontFamily="Tajawal" fontSize="130" fontWeight="900" fill="#FF6B00">
        ⚙
      </text>
    </svg>
  );
}

export default function Hero() {
  const { settings } = useSiteContent();
  const hero = settings.home.hero;
  const slides = hero.slides.filter((slide) => slide.isVisible);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCur((previous) => (previous + 1) % slides.length);
    }, hero.autoRotateMs);

    return () => window.clearInterval(timer);
  }, [hero.autoRotateMs, slides.length]);

  useEffect(() => {
    if (cur >= slides.length) {
      setCur(0);
    }
  }, [cur, slides.length]);

  if (!hero.isVisible || slides.length === 0) {
    return null;
  }

  const changeSlide = (direction: number) => {
    setCur((previous) => (previous + direction + slides.length) % slides.length);
  };

  return (
    <section className="hero" id="hero">
      <svg className="hero-bg-svg" viewBox="0 0 1440 580" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg1" cx="70%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B00" stopOpacity=".07" />
            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="580" fill="url(#rg1)" />
      </svg>

      <div className="hero-slides" style={{ transform: `translateX(${cur * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="hero-slide">
            <div className={`slide-layer slide-gradient s${(index % 3) + 1}-bg`} />
            <div className="slide-content">
              <div className="slide-eyebrow">{slide.eyebrow}</div>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <div className="slide-btns">
                <SmartLink href={slide.primaryHref} className="btn-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  </svg>
                  {slide.primaryLabel}
                </SmartLink>
                <SmartLink href={slide.secondaryHref} className="btn-outline">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {slide.secondaryLabel}
                </SmartLink>
              </div>
            </div>
            <div className="slide-visual">
              <HeroVisual index={index} />
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <div className="hero-controls">
            {slides.map((slide, index) => (
              <div key={slide.id} className={`h-dot ${cur === index ? 'active' : ''}`} onClick={() => setCur(index)} />
            ))}
          </div>
          <div className="hero-arrow prev" onClick={() => changeSlide(-1)}>
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <div className="hero-arrow next" onClick={() => changeSlide(1)}>
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </>
      ) : null}
    </section>
  );
}
