import type { ReactNode } from 'react';
import { Headphones, Repeat, ShieldCheck, Truck } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';

const ICONS: Record<string, ReactNode> = {
  'trust-delivery': <Truck />,
  'trust-certified': <ShieldCheck />,
  'trust-support': <Headphones />,
  'trust-returns': <Repeat />,
};

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
            <div className="trust-icon-wrap">{ICONS[item.id] ?? <Truck />}</div>
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
