import { useSiteContent } from '../../contexts/SiteContentContext';

const themeClassMap = {
  gold: 'ci-gold',
  blue: 'ci-blue',
  green: 'ci-green',
  orange: 'ci-orange',
} as const;

export default function Certs() {
  const { settings } = useSiteContent();
  const section = settings.home.certsSection;
  const items = section.items.filter((item) => item.isVisible);

  if (!section.isVisible || items.length === 0) {
    return null;
  }

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="container">
        <div className="sec-head">
          <div>
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.subtitle}</div>
          </div>
        </div>
        <div className="cert-grid">
          {items.map((item) => (
            <div key={item.id} className="cert-card">
              <div className={`cert-icon ${themeClassMap[item.theme]}`}>
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <div className="cert-name">{item.name}</div>
                <div className="cert-desc">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
