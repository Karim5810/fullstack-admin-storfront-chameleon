import SmartLink from './SmartLink';
import { useSiteContent } from '../contexts/SiteContentContext';

export default function Topbar() {
  const { settings } = useSiteContent();
  const topbar = settings.topbar;
  const visibleSocialLinks = topbar.socialLinks.filter((link) => link.isVisible);

  if (!topbar.isVisible) {
    return null;
  }

  return (
    <div className="topbar">
      <div className="tb-inner">
        <div className="tb-left">
          <div className="tb-item">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {topbar.location}
          </div>
          <div className="tb-item">
            <svg viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            <span dir="ltr">{topbar.phone}</span>
          </div>
          <div className="tb-item">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            {topbar.email}
          </div>
          <div className="tb-item">
            <SmartLink
              href={topbar.contactHref}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {topbar.contactLabel}
            </SmartLink>
          </div>
        </div>
        <div className="tb-right">
          <div className="tb-social">
            {visibleSocialLinks.map((link) => (
              <SmartLink key={link.id} href={link.href}>
                <span className="sr-only">{link.label}</span>
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </SmartLink>
            ))}
          </div>
          <div className="tb-lang">
            <SmartLink href="#" className="active">
              {topbar.primaryLanguageLabel}
            </SmartLink>
            <SmartLink href="#">{topbar.secondaryLanguageLabel}</SmartLink>
          </div>
        </div>
      </div>
    </div>
  );
}
