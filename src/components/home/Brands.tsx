import { useSiteContent } from '../../contexts/SiteContentContext';

export default function Brands() {
  const { settings } = useSiteContent();
  const section = settings.home.brandsSection;
  const brands = section.items.filter((item) => item.isVisible);

  if (!section.isVisible || brands.length === 0) {
    return null;
  }

  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="brands-section">
      <div className="container">
        <div className="sec-head" style={{ marginBottom: '20px' }}>
          <div>
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.subtitle}</div>
          </div>
        </div>
      </div>
      <div className="brands-track">
        <div className="brands-inner">
          {marqueeBrands.map((brand, index) => (
            <div key={`${brand.id}-${index}`} className="brand-pill">
              <svg viewBox="0 0 24 24" fill="#FF6B00">
                <circle cx="12" cy="12" r="10" />
              </svg>
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
