import { useSiteContent } from '../contexts/SiteContentContext';
import SmartLink from './SmartLink';

export default function Footer() {
  const { settings } = useSiteContent();
  const footer = settings.footer;
  const header = settings.header;

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-grid">
          <div className="f-brand">
            <SmartLink
              href="/"
              className="logo"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0' }}
            >
              <img src="/logo-192.png" alt={header.logoTitle} style={{ height: '90px', width: 'auto' }} />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>{header.logoTitle}</div>
                <div style={{ fontSize: '.6rem', color: 'var(--o)', fontWeight: '600', letterSpacing: '2px' }}>
                  {header.logoSubtitle}
                </div>
              </div>
            </SmartLink>
            <p>{footer.brandDescription}</p>
            <div className="f-social">
              {footer.socialLinks
                .filter((link) => link.isVisible)
                .map((link) => (
                  <SmartLink key={link.id} href={link.href} className="f-soc">
                    <span className="sr-only">{link.label}</span>
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </SmartLink>
                ))}
            </div>
          </div>

          {footer.columns
            .filter((column) => column.isVisible)
            .map((column) => (
              <div key={column.id} className="f-col">
                <h4>{column.title}</h4>
                <ul>
                  {column.links
                    .filter((link) => link.isVisible)
                    .map((link) => (
                      <li key={link.id}>
                        <SmartLink href={link.href}>{link.label}</SmartLink>
                      </li>
                    ))}
                </ul>
              </div>
            ))}

          <div className="f-col">
            <h4>تواصل</h4>
            <ul className="f-contact">
              {footer.contactItems
                .filter((item) => item.isVisible)
                .map((item) => (
                  <li key={item.id}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    {item.href ? (
                      <SmartLink href={item.href}>
                        {item.value}
                      </SmartLink>
                    ) : (
                      item.value
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bot">
        <div className="footer-bot-inner">
          <p>{footer.bottomText}</p>
          <div className="footer-links">
            {footer.policyLinks
              .filter((link) => link.isVisible)
              .map((link) => (
                <SmartLink key={link.id} href={link.href}>
                  {link.label}
                </SmartLink>
              ))}
          </div>
          <div className="pay-icons">
            {footer.paymentMethods.map((method) => (
              <div key={method} className="pay-pill">
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
