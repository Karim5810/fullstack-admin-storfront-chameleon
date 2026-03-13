import type { Service } from '../../types';
import { getServicePath } from '../../utils/catalog';
import { useSiteContent } from '../../contexts/SiteContentContext';
import SmartLink from '../SmartLink';

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  const { settings } = useSiteContent();
  const section = settings.home.servicesSection;

  if (!section.isVisible || services.length === 0) {
    return null;
  }

  return (
    <section className="services-section" id="services">
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
        <div className="svc-grid">
          {services.map((service) => (
            <div key={service.id} className="svc-card">
              <div className="svc-icon-wrap">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="svc-name">{service.title}</div>
              <div className="svc-desc">{service.description}</div>
              <SmartLink href={getServicePath(service)} className="svc-link">
                تفاصيل الخدمة <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
