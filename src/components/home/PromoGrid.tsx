import { useSiteContent } from '../../contexts/SiteContentContext';
import SmartLink from '../SmartLink';

const themeStyles = {
  orange: 'linear-gradient(135deg,#1a1008,#2d1f05)',
  green: 'linear-gradient(135deg,#0f1a0f,#152015)',
  blue: 'linear-gradient(135deg,#0f0f20,#151530)',
  gold: 'linear-gradient(135deg,#1a1008,#251507)',
  red: 'linear-gradient(135deg,#150818,#20101f)',
} as const;

export default function PromoGrid() {
  const { settings } = useSiteContent();
  const promoGrid = settings.home.promoGrid;
  const cards = promoGrid.cards.filter((card) => card.isVisible);
  const mainCard = cards.find((card) => card.size === 'main');
  const smallCards = cards.filter((card) => card.size === 'small');

  if (!promoGrid.isVisible || cards.length === 0 || !mainCard) {
    return null;
  }

  return (
    <section className="promo-section">
      <div className="container">
        <div className="promo-grid">
          <SmartLink href={mainCard.href} className="promo-card promo-card-main" style={{ background: themeStyles[mainCard.theme] }}>
            <svg className="pc-svg" width="360" height="360" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
              <polygon points="180,10 350,100 350,260 180,350 10,260 10,100" stroke="#FF6B00" strokeWidth="2" fill="none" />
              <polygon points="180,50 310,120 310,240 180,310 50,240 50,120" stroke="#FF6B00" strokeWidth="1" fill="none" />
            </svg>
            <div className="pc-content">
              <span className="pc-tag pc-tag-o">{mainCard.tag}</span>
              <div className="pc-title">{mainCard.title}</div>
              {mainCard.subtitle ? <div className="pc-sub">{mainCard.subtitle}</div> : null}
            </div>
          </SmartLink>

          {Array.from({ length: 2 }).map((_, columnIndex) => {
            const columnCards = smallCards.slice(columnIndex * 2, columnIndex * 2 + 2);

            return (
              <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {columnCards.map((card) => (
                  <SmartLink
                    key={card.id}
                    href={card.href}
                    className="promo-card promo-card-sm"
                    style={{ background: themeStyles[card.theme] }}
                  >
                    <div className="pc-content">
                      <span className="pc-tag pc-tag-o">{card.tag}</span>
                      <div className="pc-title">{card.title}</div>
                      {card.subtitle ? <div className="pc-sub">{card.subtitle}</div> : null}
                    </div>
                  </SmartLink>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
