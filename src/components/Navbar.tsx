import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../api';
import type { Category } from '../types';
import { useSiteContent } from '../contexts/SiteContentContext';
import SmartLink from './SmartLink';

export default function Navbar() {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const megaRef = useRef<HTMLDivElement>(null);
  const { settings } = useSiteContent();
  const navbar = settings.navbar;
  const visibleNavItems = navbar.navItems.filter((item) => item.isVisible);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.getAll();
        setCategories(data);
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(event.target as Node)) {
        setIsMegaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-(--d1) border-b border-(--border)">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8 flex items-center justify-between lg:justify-start lg:items-stretch h-[50px] lg:h-auto">
        <button
          className="lg:hidden flex items-center gap-2 text-(--chrome) bg-(--o) px-4 py-1.5 rounded-md border-none cursor-pointer"
          onClick={() => setIsMobileNavOpen((current) => !current)}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="font-bold text-sm text-white">{navbar.allCategoriesLabel}</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>

        <div className="mega-wrap hidden lg:block" ref={megaRef} onMouseEnter={() => setIsMegaOpen(true)} onMouseLeave={() => setIsMegaOpen(false)}>
          <div className="nav-all-btn" onClick={() => setIsMegaOpen((current) => !current)}>
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            {navbar.allCategoriesLabel}
            <svg viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          {isMegaOpen ? (
            <div className="mega-drop" style={{ display: 'block' }}>
              <div className="mega-header">
                <span>{loadingCategories ? '...' : `استعرض ${categories.length} فئة`}</span>
                <SmartLink href="/categories" className="category-catalog-link">
                  {navbar.catalogLinkLabel}
                </SmartLink>
              </div>
              <div className="mega-grid">
                {loadingCategories ? (
                  <div className="text-center text-(--muted2) py-4">جارٍ التحميل...</div>
                ) : categories.length > 0 ? (
                  categories.slice(0, 12).map((category) => (
                    <SmartLink key={category.id} href={`/category/${category.slug}`} className="mega-item">
                      <svg viewBox="0 0 24 24">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                      <span>{category.name}</span>
                    </SmartLink>
                  ))
                ) : (
                  <div className="text-center text-(--muted2) py-4">لا توجد فئات متاحة</div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="nav-links hidden lg:flex">
          {visibleNavItems.map((item) => (
            <NavLink key={item.id} to={item.href} className={({ isActive }) => (isActive ? 'active' : '')}>
              <svg viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              {item.label}
              {item.badge ? <span className="nav-hot">{item.badge}</span> : null}
            </NavLink>
          ))}
        </div>

        <div className="nav-end hidden lg:flex">
          <SmartLink href={navbar.ctaHref}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5l-5-5zm-1 9h-2v2H8v-2H6v-2h2v-2h2v2h2v2z" />
            </svg>
            {navbar.ctaLabel}
          </SmartLink>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="lg:hidden absolute left-0 right-0 bg-(--d2) border-b border-(--border) z-[990] shadow-lg flex flex-col">
          <div className="p-4">
            <div className="mb-3">
              <p className="text-xs uppercase tracking-[0.22em] text-(--muted2)">{navbar.categoriesMenuTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {loadingCategories ? (
                <div className="col-span-2 text-center text-xs text-(--muted2) py-2">جارٍ التحميل...</div>
              ) : categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <SmartLink
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="text-xs text-(--chrome) py-2 px-2 hover:bg-(--d3) rounded"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {category.name}
                  </SmartLink>
                ))
              ) : (
                <div className="col-span-2 text-center text-xs text-(--muted2) py-2">لا توجد فئات</div>
              )}
            </div>
            <div className="mt-4 border-t border-white/8 pt-4 space-y-2">
              {visibleNavItems.map((item) => (
                <SmartLink
                  key={item.id}
                  href={item.href}
                  className="block text-sm text-(--chrome)"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {item.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
