import { useSiteContent } from '../../contexts/SiteContentContext';
import SmartLink from '../SmartLink';

export default function AppSection() {
  const { settings } = useSiteContent();
  const section = settings.home.appSection;

  if (!section.isVisible) {
    return null;
  }

  return (
    <section className="app-section">
      <div className="container">
        <div className="app-box">
          <div className="app-text">
            {section.eyebrow ? <div className="sec-label" style={{ marginBottom: '12px' }}>{section.eyebrow}</div> : null}
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            <div className="app-btns">
              <SmartLink href={section.primaryStoreHref} className="app-btn">
                <svg viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor" />
                </svg>
                <div className="app-btn-text"><small>حمّل من</small><strong>{section.primaryStoreLabel}</strong></div>
              </SmartLink>
              <SmartLink href={section.secondaryStoreHref} className="app-btn">
                <svg viewBox="0 0 24 24">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" fill="currentColor" />
                </svg>
                <div className="app-btn-text"><small>حمّل من</small><strong>{section.secondaryStoreLabel}</strong></div>
              </SmartLink>
            </div>
          </div>
          <div className="app-visual">
            <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="10" width="160" height="260" rx="20" fill="none" stroke="#FF6B00" strokeWidth="1.5" />
              <rect x="30" y="24" width="140" height="220" rx="10" fill="none" stroke="#FF6B00" strokeWidth=".5" />
              <circle cx="100" cy="258" r="8" fill="none" stroke="#FF6B00" strokeWidth="1" />
              <rect x="75" y="14" width="50" height="6" rx="3" fill="rgba(255,107,0,0.2)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
