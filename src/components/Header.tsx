import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCommerce } from '../contexts/CommerceContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { useTheme } from '../contexts/ThemeContext';
import SmartLink from './SmartLink';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount, wishlistCount } = useCommerce();
  const { settings } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const header = settings.header;
  const navbar = settings.navbar;
  const visibleNavItems = navbar.navItems.filter((item) => item.isVisible);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    navigate('/');
  };

  return (
    <>
      <header className="site-header h-16 md:h-20 lg:h-24">
        <div className="h-inner h-16 md:h-20 lg:h-24">
          <button type="button" className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link to="/" className="logo">
            <img
              src="/logo-192.png"
              alt={header.logoTitle}
              className="h-12 w-auto md:h-[72px] lg:h-[95px]"
            />
            <div className="logo-words" style={{ marginLeft: '10px' }}>
              
            </div>
          </Link>

          <form className="search-wrap" onSubmit={handleSearch}>
            <span className="s-cat">
              {header.allCategoriesLabel}
              <svg viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={header.searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="submit" className="s-btn">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" fill="none" />
                <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              {header.searchButtonLabel}
            </button>
          </form>

          <div className="h-actions">
            <Link to="/account" className="h-act">
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {header.accountLabel}
            </Link>
            <Link to="/orders" className="h-act">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {header.ordersLabel}
            </Link>
            <Link to="/wishlist" className="h-act">
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {header.wishlistLabel}
              {wishlistCount > 0 ? <span className="badge">{wishlistCount}</span> : null}
            </Link>
            <Link to="/cart" className="h-act">
              <svg viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {header.cartLabel}
              {cartCount > 0 ? <span className="badge">{cartCount}</span> : null}
            </Link>
            <div className="h-divider hidden md:block" />
          </div>

          <div className="h-ctas">
          <button
  type="button"
  onClick={toggleTheme}
  className="btn-ghost"
  aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
>
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="w-6 h-6"
  >
    {theme === 'dark' ? (
      // Sun Icon (Switch to Light)
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    ) : (
      // Moon Icon (Switch to Dark)
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
    )}
  </svg>
</button>
            {isAuthenticated && user ? (
              <>
                <span className="px-3 py-2 text-[0.82rem] text-(--chrome2)">
                  {header.welcomePrefix} {user.name}
                </span>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn-ghost">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-18v8h8V3h-8zM3 21h8v-6H3v6z" />
                    </svg>
                    {header.adminLabel}
                  </Link>
                ) : null}
                <button type="button" onClick={handleSignOut} className="btn-fire">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                  </svg>
                  {header.logoutLabel}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                  </svg>
                  {header.loginLabel}
                </Link>
                <Link to="/register" className="btn-fire">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {header.registerLabel}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo-192.png" alt={header.logoTitle} style={{ height: '32px', width: 'auto' }} />
            <div className="logo-words" style={{ marginLeft: '10px' }}>
              <span className="logo-ar">{header.logoTitle}</span>
            </div>
          </Link>
          <button type="button" className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-menu-section">
            {isAuthenticated && user ? (
              <>
                <div className="mb-3 px-3 py-2 text-center text-[0.82rem] text-(--chrome2)">
                  {header.welcomePrefix} {user.name}
                </div>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn-ghost mb-3 w-full justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                    {header.adminLabel}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    void handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-fire w-full justify-center"
                >
                  {header.logoutLabel}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost mb-3 w-full justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                  {header.loginLabel}
                </Link>
                <Link to="/register" className="btn-fire w-full justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                  {header.registerLabel}
                </Link>
              </>
            )}
          </div>

          <div className="mobile-menu-section">
            <h4 className="mobile-menu-title">{navbar.mobileMenuTitle}</h4>
            {visibleNavItems.map((item) => (
              <SmartLink key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </SmartLink>
            ))}
            <SmartLink href={navbar.ctaHref} onClick={() => setIsMobileMenuOpen(false)}>
              {navbar.ctaLabel}
            </SmartLink>
          </div>
        </div>
      </div>
    </>
  );
}
