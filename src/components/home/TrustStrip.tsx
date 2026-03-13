import { useSiteContent } from '../../contexts/SiteContentContext';

export default function TrustStrip() {
  const { settings } = useSiteContent();
  const trustStrip = settings.home.trustStrip;
  const items = trustStrip.items.filter((item) => item.isVisible);

  if (!trustStrip.isVisible || items.length === 0) {
    return null;
  }

  return (
    <div className="trust-strip">
      <div className="trust-inner">
        {items.map((item) => (
          <div key={item.id} className="trust-cell">
            <div className="trust-icon-wrap">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div className="trust-text">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
