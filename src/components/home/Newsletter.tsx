import { useState } from 'react';
import { api } from '../../api';
import { useSiteContent } from '../../contexts/SiteContentContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSiteContent();
  const section = settings.home.newsletterSection;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await api.newsletter.subscribe(email);
      setMessage(section.successLabel);
      setEmail('');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : section.errorLabel);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!section.isVisible) {
    return null;
  }

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="nl-box">
          <div className="nl-bg">
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid slice">
              <circle cx="100" cy="100" r="150" fill="none" stroke="#FF6B00" strokeWidth="1" opacity=".04" />
              <circle cx="100" cy="100" r="100" fill="none" stroke="#FF6B00" strokeWidth=".5" opacity=".06" strokeDasharray="6 4" />
              <circle cx="900" cy="100" r="150" fill="none" stroke="#FF6B00" strokeWidth="1" opacity=".04" />
              <circle cx="900" cy="100" r="100" fill="none" stroke="#FF6B00" strokeWidth=".5" opacity=".06" strokeDasharray="6 4" />
              <line x1="250" y1="100" x2="750" y2="100" stroke="#FF6B00" strokeWidth=".5" opacity=".06" strokeDasharray="8 6" />
            </svg>
          </div>
          {section.eyebrow ? <div className="sec-label" style={{ marginBottom: '14px', display: 'inline-flex' }}>{section.eyebrow}</div> : null}
          <h2>{section.title}</h2>
          <p>{section.subtitle}</p>
          <form className="nl-form" onSubmit={(event) => void handleSubmit(event)}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={section.placeholder}
              required
            />
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" /></svg>
              {isSubmitting ? section.loadingLabel : section.submitLabel}
            </button>
          </form>
          {message ? <p className="text-sm text-emerald-300 mt-3">{message}</p> : null}
          {error ? <p className="text-sm text-red-300 mt-3">{error}</p> : null}
          <div className="nl-note">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            {section.note}
          </div>
        </div>
      </div>
    </section>
  );
}
