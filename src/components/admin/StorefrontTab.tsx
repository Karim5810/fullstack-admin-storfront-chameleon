/**
 * StorefrontTab.tsx
 *
 * Storefront publishing panel.
 * Owns: draft state display, basic settings form, advanced JSON editors.
 *
 * Previously renderStorefrontPanel() — ~90 lines inlined in AdminDashboard.tsx.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../api';
import { Field, Panel, SectionCard, ToggleField, textInputClass } from './AdminShell';
import type { useAdminDashboardController } from '../../hooks/useAdminDashboardController';
import type { FooterColumn, FooterContactItem, HeroSlide, PromoCard, SiteFeatureItem, SiteLink, SiteSocialLink } from '../../types';
import type { ImageRegistryEntry } from '../../services/api/imageRegistry';
import { useImageRegistry } from '../../contexts/ImageRegistryContext';

type Props = {
  controller: ReturnType<typeof useAdminDashboardController>;
  onPublish: () => Promise<void>;
};

function makeId(prefix: string) {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `${prefix}_${uuid}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = items.slice();
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  const tmp = next[index];
  next[index] = next[target];
  next[target] = tmp;
  return next;
}

function ImageRegistryEditor() {
  const { reload } = useImageRegistry();
  const [entries, setEntries] = useState<ImageRegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.imageRegistry.getEntries();
      setEntries(list);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.imageRegistry.upsert(entries);
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const setUrl = (index: number, url: string) => {
    const next = entries.slice();
    next[index] = { ...next[index], url };
    setEntries(next);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">سجل الصور</div>
          <div className="text-xs text-slate-500">
            ربط الكود بعنوان الصورة. herot-1 للهيرو الأول، Cat-1 للفئة الأولى، إلخ.
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={entry.code} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <code className="w-20 shrink-0 rounded bg-slate-200 px-2 py-1 text-xs font-mono text-slate-800">
              {entry.code}
            </code>
            <span className="text-slate-400">|</span>
            <input
              type="url"
              placeholder="https://..."
              className={textInputClass() + ' flex-1'}
              value={entry.url}
              onChange={(e) => setUrl(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RowActions({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const btn =
    'inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40';
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className={btn} onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </button>
      <button type="button" className={btn} onClick={onRemove} aria-label="Remove">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function StorefrontTab({ controller, onPublish }: Props) {
  const draft = controller.storefrontDraft;
  type AdvancedSectionId =
    | 'images'
    | 'hero'
    | 'trust'
    | 'promo'
    | 'brands'
    | 'certs'
    | 'stats'
    | 'topbarSocials'
    | 'navbar'
    | 'footerSocials'
    | 'footerContacts'
    | 'footerColumns'
    | 'footerPolicies'
    | 'footerPayments';
  const advancedSections: Array<{ id: AdvancedSectionId; label: string; helper: string }> = [
    { id: 'images', label: 'صور المتجر', helper: 'Hero & Categories images' },
    { id: 'hero', label: 'Hero slides', helper: 'Homepage slideshow' },
    { id: 'trust', label: 'Trust strip', helper: 'Hero support bullets' },
    { id: 'promo', label: 'Promo cards', helper: 'Homepage promo grid' },
    { id: 'brands', label: 'Brands', helper: 'Homepage brands list' },
    { id: 'certs', label: 'Certificates', helper: 'Homepage assurances' },
    { id: 'stats', label: 'Stats', helper: 'Homepage counters' },
    { id: 'topbarSocials', label: 'Topbar socials', helper: 'Top strip icons' },
    { id: 'navbar', label: 'Navbar items', helper: 'Main navigation links' },
    { id: 'footerSocials', label: 'Footer socials', helper: 'Footer social icons' },
    { id: 'footerContacts', label: 'Footer contacts', helper: 'Footer contact rows' },
    { id: 'footerColumns', label: 'Footer columns', helper: 'Footer link groups' },
    { id: 'footerPolicies', label: 'Footer policies', helper: 'Bottom policy links' },
    { id: 'footerPayments', label: 'Payment methods', helper: 'Footer payment chips' },
  ];
  const [advancedSection, setAdvancedSection] = useState<AdvancedSectionId>('hero');
  const lastPaymentMethods = useRef<string[] | null>(null);

  const setField = (
    section: keyof typeof draft,
    key: string,
    value: string | boolean
  ) => {
    if (section === 'home') {
      controller.setStorefrontDraft({
        ...draft,
        home: {
          ...draft.home,
          [key]: typeof value === 'boolean'
            ? { ...draft.home[key], isVisible: value }
            : { ...draft.home[key], [key]: value },
        },
      });
    } else if (section === 'footer') {
      controller.setStorefrontDraft({
        ...draft,
        footer: {
          ...draft.footer,
          [key]: value,
        },
      });
    } else if (section === 'topbar' || section === 'header') {
      controller.setStorefrontDraft({
        ...draft,
        [section]: {
          ...draft[section],
          [key]: value,
        },
      });
    }
  };

  const sectionDescriptionClass = 'text-sm leading-6 text-slate-600';

  const advancedEnabled = useMemo(() => {
    const anyVisible = <T extends { isVisible: boolean }>(items: T[]) => items.some((item) => item.isVisible);

    switch (advancedSection) {
      case 'images':
        return true;
      case 'hero':
        return Boolean(draft.home.hero.isVisible);
      case 'trust':
        return Boolean(draft.home.trustStrip.isVisible);
      case 'promo':
        return Boolean(draft.home.promoGrid.isVisible);
      case 'brands':
        return Boolean(draft.home.brandsSection.isVisible);
      case 'certs':
        return Boolean(draft.home.certsSection.isVisible);
      case 'stats':
        return Boolean(draft.home.statsSection.isVisible);
      case 'topbarSocials':
        return Boolean(draft.topbar.isVisible);
      case 'navbar':
        return anyVisible(controller.navbarItems);
      case 'footerSocials':
        return anyVisible(controller.footerSocialLinks);
      case 'footerContacts':
        return anyVisible(controller.footerContacts);
      case 'footerColumns':
        return anyVisible(controller.footerColumns);
      case 'footerPolicies':
        return anyVisible(controller.footerPolicies);
      case 'footerPayments':
        return controller.footerPayments.length > 0;
    }
  }, [
    advancedSection,
    controller.footerColumns,
    controller.footerContacts,
    controller.footerPayments,
    controller.footerPolicies,
    controller.footerSocialLinks,
    controller.navbarItems,
    draft.home.brandsSection.isVisible,
    draft.home.certsSection.isVisible,
    draft.home.hero.isVisible,
    draft.home.promoGrid.isVisible,
    draft.home.statsSection.isVisible,
    draft.home.trustStrip.isVisible,
    draft.topbar.isVisible,
  ]);

  const setAdvancedEnabled = (enabled: boolean) => {
    const setHomeVisible = (key: keyof typeof draft.home, value: boolean) => {
      controller.setStorefrontDraft({
        ...draft,
        home: {
          ...draft.home,
          [key]: { ...(draft.home[key] as object), isVisible: value },
        },
      });
    };

    const setTopbarVisible = (value: boolean) => {
      controller.setStorefrontDraft({
        ...draft,
        topbar: { ...draft.topbar, isVisible: value },
      });
    };

    const bulkSetVisible = <T extends { isVisible: boolean }>(items: T[], setter: (next: T[]) => void, value: boolean) => {
      setter(items.map((item) => ({ ...item, isVisible: value })));
    };

    switch (advancedSection) {
      case 'images':
        return;
      case 'hero':
        setHomeVisible('hero', enabled);
        return;
      case 'trust':
        setHomeVisible('trustStrip', enabled);
        return;
      case 'promo':
        setHomeVisible('promoGrid', enabled);
        return;
      case 'brands':
        setHomeVisible('brandsSection', enabled);
        return;
      case 'certs':
        setHomeVisible('certsSection', enabled);
        return;
      case 'stats':
        setHomeVisible('statsSection', enabled);
        return;
      case 'topbarSocials':
        setTopbarVisible(enabled);
        return;
      case 'navbar':
        bulkSetVisible(controller.navbarItems, controller.setNavbarItems, enabled);
        return;
      case 'footerSocials':
        bulkSetVisible(controller.footerSocialLinks, controller.setFooterSocialLinks, enabled);
        return;
      case 'footerContacts':
        bulkSetVisible(controller.footerContacts, controller.setFooterContacts, enabled);
        return;
      case 'footerColumns':
        bulkSetVisible(controller.footerColumns, controller.setFooterColumns, enabled);
        return;
      case 'footerPolicies':
        bulkSetVisible(controller.footerPolicies, controller.setFooterPolicies, enabled);
        return;
      case 'footerPayments': {
        if (!enabled) {
          if (controller.footerPayments.length > 0) {
            lastPaymentMethods.current = controller.footerPayments;
          }
          controller.setFooterPayments([]);
          return;
        }

        const restore = lastPaymentMethods.current;
        if (restore && restore.length > 0) {
          controller.setFooterPayments(restore);
        } else {
          controller.setFooterPayments(['']);
        }
        return;
      }
    }
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Storefront settings"
        eyebrow="Storefront"
        actions={
          <button type="button" className="btn-fire" onClick={() => void onPublish()} disabled={controller.isSaving}>
            <Save className="h-4 w-4" />
            {controller.isSaving ? 'Publishing…' : 'Publish changes'}
          </button>
        }
      >
        <div className="space-y-6">
          <SectionCard title="Visibility">
            <ToggleField
              label="Show hero slideshow"
              checked={draft.home.hero.isVisible ?? true}
              onChange={(v) => setField('home', 'hero', v)}
            />
            <ToggleField
              label="Show featured products"
              checked={draft.home.productsSection.isVisible ?? true}
              onChange={(v) => setField('home', 'productsSection', v)}
            />
            <ToggleField
              label="Show trust strip"
              checked={draft.home.trustStrip.isVisible ?? true}
              onChange={(v) => setField('home', 'trustStrip', v)}
            />
            <ToggleField
              label="Show promo cards"
              checked={draft.home.promoGrid.isVisible ?? true}
              onChange={(v) => setField('home', 'promoGrid', v)}
            />
            <ToggleField
              label="Show brands"
              checked={draft.home.brandsSection.isVisible ?? true}
              onChange={(v) => setField('home', 'brandsSection', v)}
            />
            <ToggleField
              label="Show stats"
              checked={draft.home.statsSection.isVisible ?? true}
              onChange={(v) => setField('home', 'statsSection', v)}
            />
            <ToggleField
              label="Show certificates"
              checked={draft.home.certsSection.isVisible ?? true}
              onChange={(v) => setField('home', 'certsSection', v)}
            />
            <ToggleField
              label="Show products"
              checked={draft.home.productsSection.isVisible ?? true}
              onChange={(v) => setField('home', 'productsSection', v)}
            />
            <ToggleField
              label="Show services"
              checked={draft.home.servicesSection.isVisible ?? true}
              onChange={(v) => setField('home', 'servicesSection', v)}
            />
            <ToggleField
              label="Show blog"
              checked={draft.home.blogSection.isVisible ?? true}
              onChange={(v) => setField('home', 'blogSection', v)}
            />
            <ToggleField
              label="Show newsletter"
              checked={draft.home.newsletterSection.isVisible ?? true}
              onChange={(v) => setField('home', 'newsletterSection', v)}
            />
            <ToggleField
              label="Show app"
              checked={draft.home.appSection.isVisible ?? true}
              onChange={(v) => setField('home', 'appSection', v)}
            />
            <ToggleField
              label="Show deals"
              checked={draft.home.dealsSection.isVisible ?? true}
              onChange={(v) => setField('home', 'dealsSection', v)}
            />
            <ToggleField
              label="Show categories"
              checked={draft.home.categoriesSection.isVisible ?? true}
              onChange={(v) => setField('home', 'categoriesSection', v)}
            />
          </SectionCard>

          <SectionCard title="Basic settings">
            <Field label="Site name">
              <input
                className={`${textInputClass()} border-slate-200 bg-white text-slate-900`}
                value={draft.header.logoTitle ?? ''}
                onChange={(e) => setField('header', 'logoTitle', e.target.value)}
              />
            </Field>
            <Field label="Contact strip phone">
              <input
                className={`${textInputClass()} border-slate-200 bg-white text-slate-900`}
                value={draft.topbar.phone ?? ''}
                onChange={(e) => setField('topbar', 'phone', e.target.value)}
              />
            </Field>
            <Field label="Search placeholder">
              <input
                className={`${textInputClass()} border-slate-200 bg-white text-slate-900`}
                value={draft.header.searchPlaceholder ?? ''}
                onChange={(e) => setField('header', 'searchPlaceholder', e.target.value)}
              />
            </Field>
            <Field label="Footer copyright">
              <input
                className={`${textInputClass()} border-slate-200 bg-white text-slate-900`}
                value={draft.footer.bottomText ?? ''}
                onChange={(e) => setField('footer', 'bottomText', e.target.value)}
              />
            </Field>
          </SectionCard>

          <SectionCard title="Advanced settings">
            <p className={sectionDescriptionClass}>
              Manage slideshow content, links, badges, and other structured data using form inputs. Changes are saved as the same underlying data model — no JSON editing.
            </p>

            <div className="mt-4 grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
              <div className="rounded-3xl border border-slate-200 bg-white p-3">
                <Field label="Section">
                  <select
                    className={textInputClass()}
                    value={advancedSection}
                    onChange={(e) => setAdvancedSection(e.target.value as AdvancedSectionId)}
                  >
                    {advancedSections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="mt-3 hidden space-y-1 xl:block">
                  {advancedSections.map((s) => {
                    const active = advancedSection === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setAdvancedSection(s.id)}
                        className={`w-full rounded-2xl border px-3 py-2 text-left transition-colors ${
                          active
                            ? 'border-orange-300 bg-orange-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-sm font-semibold">{s.label}</div>
                        <div className="text-xs text-slate-500">{s.helper}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                {advancedSection !== 'images' ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <ToggleField
                      label="Section enabled"
                      description="Turn this section on/off without deleting its content."
                      checked={advancedEnabled}
                      onChange={(v) => setAdvancedEnabled(v)}
                    />
                  </div>
                ) : null}

                {advancedSection === 'images' ? (
                  <ImageRegistryEditor />
                ) : advancedSection === 'hero' ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Hero slides</div>
                        <div className="text-xs text-slate-500">Homepage hero slideshow cards.</div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        onClick={() =>
                          controller.setHeroSlides([
                            ...controller.heroSlides,
                            {
                              id: makeId('hero'),
                              eyebrow: '',
                              title: '',
                              description: '',
                              primaryLabel: '',
                              primaryHref: '',
                              secondaryLabel: '',
                              secondaryHref: '',
                              isVisible: true,
                            } satisfies HeroSlide,
                          ])
                        }
                      >
                        <Plus className="h-4 w-4" /> Add slide
                      </button>
                    </div>

                    <div className="space-y-3">
                      {controller.heroSlides.map((slide, index) => (
                        <div key={slide.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900">{slide.title || 'Untitled slide'}</div>
                              <div className="text-xs text-slate-500">ID: {slide.id}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={slide.isVisible}
                                  onChange={(e) => {
                                    const next = controller.heroSlides.slice();
                                    next[index] = { ...slide, isVisible: e.target.checked };
                                    controller.setHeroSlides(next);
                                  }}
                                />
                                Visible
                              </label>
                              <RowActions
                                index={index}
                                count={controller.heroSlides.length}
                                onMove={(direction) => controller.setHeroSlides(moveItem(controller.heroSlides, index, direction))}
                                onRemove={() => controller.setHeroSlides(controller.heroSlides.filter((s) => s.id !== slide.id))}
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <Field label="Eyebrow">
                              <input
                                className={textInputClass()}
                                value={slide.eyebrow}
                                onChange={(e) => {
                                  const next = controller.heroSlides.slice();
                                  next[index] = { ...slide, eyebrow: e.target.value };
                                  controller.setHeroSlides(next);
                                }}
                              />
                            </Field>
                            <Field label="Title">
                              <input
                                className={textInputClass()}
                                value={slide.title}
                                onChange={(e) => {
                                  const next = controller.heroSlides.slice();
                                  next[index] = { ...slide, title: e.target.value };
                                  controller.setHeroSlides(next);
                                }}
                              />
                            </Field>
                            <div className="md:col-span-2">
                              <Field label="Description">
                                <input
                                  className={textInputClass()}
                                  value={slide.description}
                                  onChange={(e) => {
                                    const next = controller.heroSlides.slice();
                                    next[index] = { ...slide, description: e.target.value };
                                    controller.setHeroSlides(next);
                                  }}
                                />
                              </Field>
                            </div>
                            <Field label="Primary button label">
                              <input
                                className={textInputClass()}
                                value={slide.primaryLabel}
                                onChange={(e) => {
                                  const next = controller.heroSlides.slice();
                                  next[index] = { ...slide, primaryLabel: e.target.value };
                                  controller.setHeroSlides(next);
                                }}
                              />
                            </Field>
                            <Field label="Primary button href">
                              <input
                                className={textInputClass()}
                                value={slide.primaryHref}
                                onChange={(e) => {
                                  const next = controller.heroSlides.slice();
                                  next[index] = { ...slide, primaryHref: e.target.value };
                                  controller.setHeroSlides(next);
                                }}
                              />
                            </Field>
                            <Field label="Secondary button label">
                              <input
                                className={textInputClass()}
                                value={slide.secondaryLabel}
                                onChange={(e) => {
                                  const next = controller.heroSlides.slice();
                                  next[index] = { ...slide, secondaryLabel: e.target.value };
                                  controller.setHeroSlides(next);
                                }}
                              />
                            </Field>
                            <Field label="Secondary button href">
                              <input
                                className={textInputClass()}
                                value={slide.secondaryHref}
                                onChange={(e) => {
                                  const next = controller.heroSlides.slice();
                                  next[index] = { ...slide, secondaryHref: e.target.value };
                                  controller.setHeroSlides(next);
                                }}
                              />
                            </Field>
                          </div>
                        </div>
                      ))}

                      {controller.heroSlides.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-(--border) bg-(--d3) px-4 py-6 text-sm text-(--muted2)">
                          No slides yet. Add one to start.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {advancedSection === 'trust' ? (
                  <SimpleFeatureItemsEditor
                    title="Trust strip"
                    description="Small feature bullets shown below the hero."
                    items={controller.trustItems}
                    onChange={controller.setTrustItems}
                  />
                ) : null}

                {advancedSection === 'promo' ? (
                  <PromoCardsEditor cards={controller.promoCards} onChange={controller.setPromoCards} />
                ) : null}

                {advancedSection === 'brands' ? (
                  <SimpleNameListEditor
                    title="Brands"
                    description="Brand list shown on the homepage."
                    items={controller.brands}
                    onChange={controller.setBrands}
                    makeItem={() => ({ id: makeId('brand'), name: '', isVisible: true })}
                    getLabel={(item) => item.name || 'Untitled brand'}
                    renderFields={(item, index, next) => (
                      <Field label="Name">
                        <input
                          className={textInputClass()}
                          value={item.name}
                          onChange={(e) => next(index, { ...item, name: e.target.value })}
                        />
                      </Field>
                    )}
                  />
                ) : null}

                {advancedSection === 'certs' ? (
                  <CertificatesEditor items={controller.certificates} onChange={controller.setCertificates} />
                ) : null}

                {advancedSection === 'stats' ? (
                  <StatsEditor items={controller.stats} onChange={controller.setStats} />
                ) : null}

                {advancedSection === 'topbarSocials' ? (
                  <LinksEditor title="Topbar socials" description="Social icons in the top bar." links={controller.topbarSocialLinks} onChange={controller.setTopbarSocialLinks} />
                ) : null}

                {advancedSection === 'navbar' ? (
                  <LinksEditor title="Navbar items" description="Top navigation links." links={controller.navbarItems} onChange={controller.setNavbarItems} />
                ) : null}

                {advancedSection === 'footerSocials' ? (
                  <LinksEditor title="Footer socials" description="Social icons in the footer." links={controller.footerSocialLinks} onChange={controller.setFooterSocialLinks} />
                ) : null}

                {advancedSection === 'footerContacts' ? (
                  <FooterContactsEditor items={controller.footerContacts} onChange={controller.setFooterContacts} />
                ) : null}

                {advancedSection === 'footerColumns' ? (
                  <FooterColumnsEditor columns={controller.footerColumns} onChange={controller.setFooterColumns} />
                ) : null}

                {advancedSection === 'footerPolicies' ? (
                  <LinksEditor title="Footer policies" description="Policy links shown in the footer bottom bar." links={controller.footerPolicies} onChange={controller.setFooterPolicies} />
                ) : null}

                {advancedSection === 'footerPayments' ? (
                  <PaymentMethodsEditor methods={controller.footerPayments} onChange={controller.setFooterPayments} />
                ) : null}
              </div>
            </div>
          </SectionCard>
        </div>
      </Panel>
    </div>
  );
}

function SimpleFeatureItemsEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string;
  description: string;
  items: SiteFeatureItem[];
  onChange: (items: SiteFeatureItem[]) => void;
}) {
  return (
    <SimpleNameListEditor
      title={title}
      description={description}
      items={items}
      onChange={onChange}
      makeItem={() => ({ id: makeId('feature'), title: '', subtitle: '', isVisible: true })}
      getLabel={(item) => item.title || 'Untitled item'}
      renderFields={(item, index, next) => (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input className={textInputClass()} value={item.title} onChange={(e) => next(index, { ...item, title: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <input className={textInputClass()} value={item.subtitle} onChange={(e) => next(index, { ...item, subtitle: e.target.value })} />
          </Field>
        </div>
      )}
    />
  );
}

function SimpleNameListEditor<T extends { id: string; isVisible: boolean }>({
  title,
  description,
  items,
  onChange,
  makeItem,
  getLabel,
  renderFields,
}: {
  title: string;
  description: string;
  items: T[];
  onChange: (items: T[]) => void;
  makeItem: () => T;
  getLabel: (item: T) => string;
  renderFields: (item: T, index: number, updateAt: (index: number, next: T) => void) => React.ReactNode;
}) {
  const updateAt = (index: number, next: T) => {
    const copy = items.slice();
    copy[index] = next;
    onChange(copy);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => onChange([...items, makeItem()])}
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{getLabel(item)}</div>
                <div className="text-xs text-slate-500">ID: {item.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={item.isVisible}
                    onChange={(e) => updateAt(index, { ...item, isVisible: e.target.checked })}
                  />
                  Visible
                </label>
                <RowActions
                  index={index}
                  count={items.length}
                  onMove={(direction) => onChange(moveItem(items, index, direction))}
                  onRemove={() => onChange(items.filter((x) => x.id !== item.id))}
                />
              </div>
            </div>
            {renderFields(item, index, updateAt)}
          </div>
        ))}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-(--border) bg-(--d3) px-4 py-6 text-sm text-(--muted2)">
            Nothing here yet. Add one to start.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PromoCardsEditor({ cards, onChange }: { cards: PromoCard[]; onChange: (cards: PromoCard[]) => void }) {
  const updateAt = (index: number, next: PromoCard) => {
    const copy = cards.slice();
    copy[index] = next;
    onChange(copy);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Promo cards</div>
          <div className="text-xs text-slate-500">Homepage promo grid cards.</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() =>
            onChange([
              ...cards,
              {
                id: makeId('promo'),
                size: 'small',
                theme: 'orange',
                tag: '',
                title: '',
                subtitle: '',
                href: '',
                isVisible: true,
              },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add card
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((card, index) => (
          <div key={card.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{card.title || 'Untitled card'}</div>
                <div className="text-xs text-slate-500">ID: {card.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={card.isVisible}
                    onChange={(e) => updateAt(index, { ...card, isVisible: e.target.checked })}
                  />
                  Visible
                </label>
                <RowActions
                  index={index}
                  count={cards.length}
                  onMove={(direction) => onChange(moveItem(cards, index, direction))}
                  onRemove={() => onChange(cards.filter((c) => c.id !== card.id))}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Size">
                <select className={textInputClass()} value={card.size} onChange={(e) => updateAt(index, { ...card, size: e.target.value as PromoCard['size'] })}>
                  <option value="main">Main</option>
                  <option value="small">Small</option>
                </select>
              </Field>
              <Field label="Theme">
                <select className={textInputClass()} value={card.theme} onChange={(e) => updateAt(index, { ...card, theme: e.target.value as PromoCard['theme'] })}>
                  <option value="orange">Orange</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="gold">Gold</option>
                  <option value="red">Red</option>
                </select>
              </Field>
              <Field label="Tag">
                <input className={textInputClass()} value={card.tag} onChange={(e) => updateAt(index, { ...card, tag: e.target.value })} />
              </Field>
              <Field label="Title">
                <input className={textInputClass()} value={card.title} onChange={(e) => updateAt(index, { ...card, title: e.target.value })} />
              </Field>
              <Field label="Subtitle (optional)">
                <input className={textInputClass()} value={card.subtitle ?? ''} onChange={(e) => updateAt(index, { ...card, subtitle: e.target.value })} />
              </Field>
              <Field label="Href">
                <input className={textInputClass()} value={card.href} onChange={(e) => updateAt(index, { ...card, href: e.target.value })} />
              </Field>
            </div>
          </div>
        ))}
        {cards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-(--border) bg-(--d3) px-4 py-6 text-sm text-(--muted2)">
            No promo cards yet. Add one to start.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LinksEditor<T extends SiteLink>({
  title,
  description,
  links,
  onChange,
}: {
  title: string;
  description: string;
  links: T[];
  onChange: (links: T[]) => void;
}) {
  const updateAt = (index: number, next: T) => {
    const copy = links.slice();
    copy[index] = next;
    onChange(copy);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() =>
            onChange([
              ...links,
              {
                id: makeId('link'),
                label: '',
                href: '',
                isVisible: true,
                badge: '',
              } as T,
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add link
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={link.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{link.label || 'Untitled link'}</div>
                <div className="text-xs text-slate-500">ID: {link.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={link.isVisible}
                    onChange={(e) => updateAt(index, { ...link, isVisible: e.target.checked })}
                  />
                  Visible
                </label>
                <RowActions
                  index={index}
                  count={links.length}
                  onMove={(direction) => onChange(moveItem(links, index, direction))}
                  onRemove={() => onChange(links.filter((l) => l.id !== link.id))}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Label">
                <input className={textInputClass()} value={link.label} onChange={(e) => updateAt(index, { ...link, label: e.target.value })} />
              </Field>
              <Field label="Href">
                <input className={textInputClass()} value={link.href} onChange={(e) => updateAt(index, { ...link, href: e.target.value })} />
              </Field>
              <Field label="Badge (optional)">
                <input className={textInputClass()} value={link.badge ?? ''} onChange={(e) => updateAt(index, { ...link, badge: e.target.value || undefined })} />
              </Field>
            </div>
          </div>
        ))}
        {links.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No links yet. Add one to start.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FooterContactsEditor({ items, onChange }: { items: FooterContactItem[]; onChange: (items: FooterContactItem[]) => void }) {
  const updateAt = (index: number, next: FooterContactItem) => {
    const copy = items.slice();
    copy[index] = next;
    onChange(copy);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Footer contacts</div>
          <div className="text-xs text-slate-500">Contact rows in the footer.</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() =>
            onChange([
              ...items,
              { id: makeId('contact'), label: '', value: '', href: '', isVisible: true },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add contact
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{item.label || 'Untitled contact'}</div>
                <div className="text-xs text-slate-500">ID: {item.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={item.isVisible}
                    onChange={(e) => updateAt(index, { ...item, isVisible: e.target.checked })}
                  />
                  Visible
                </label>
                <RowActions
                  index={index}
                  count={items.length}
                  onMove={(direction) => onChange(moveItem(items, index, direction))}
                  onRemove={() => onChange(items.filter((x) => x.id !== item.id))}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Label">
                <input className={textInputClass()} value={item.label} onChange={(e) => updateAt(index, { ...item, label: e.target.value })} />
              </Field>
              <Field label="Value">
                <input className={textInputClass()} value={item.value} onChange={(e) => updateAt(index, { ...item, value: e.target.value })} />
              </Field>
              <Field label="Href (optional)">
                <input className={textInputClass()} value={item.href ?? ''} onChange={(e) => updateAt(index, { ...item, href: e.target.value || undefined })} />
              </Field>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No contacts yet. Add one to start.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FooterColumnsEditor({ columns, onChange }: { columns: FooterColumn[]; onChange: (columns: FooterColumn[]) => void }) {
  const updateAt = (index: number, next: FooterColumn) => {
    const copy = columns.slice();
    copy[index] = next;
    onChange(copy);
  };

  const updateLinkAt = (columnIndex: number, linkIndex: number, nextLink: SiteLink) => {
    const column = columns[columnIndex];
    const nextLinks = column.links.slice();
    nextLinks[linkIndex] = nextLink;
    updateAt(columnIndex, { ...column, links: nextLinks });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Footer columns</div>
          <div className="text-xs text-slate-500">Footer link groups (each column contains links).</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() =>
            onChange([
              ...columns,
              { id: makeId('col'), title: '', isVisible: true, links: [] },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add column
        </button>
      </div>

      <div className="space-y-3">
        {columns.map((column, index) => (
          <div key={column.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{column.title || 'Untitled column'}</div>
                <div className="text-xs text-slate-500">ID: {column.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={column.isVisible}
                    onChange={(e) => updateAt(index, { ...column, isVisible: e.target.checked })}
                  />
                  Visible
                </label>
                <RowActions
                  index={index}
                  count={columns.length}
                  onMove={(direction) => onChange(moveItem(columns, index, direction))}
                  onRemove={() => onChange(columns.filter((c) => c.id !== column.id))}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title">
                <input className={textInputClass()} value={column.title} onChange={(e) => updateAt(index, { ...column, title: e.target.value })} />
              </Field>
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={() => updateAt(index, { ...column, links: [...column.links, { id: makeId('link'), label: '', href: '', isVisible: true }] })}
                >
                  <Plus className="h-4 w-4" /> Add link
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {column.links.map((link, linkIndex) => (
                <div key={link.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{link.label || 'Untitled link'}</div>
                      <div className="text-xs text-slate-500">ID: {link.id}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={link.isVisible}
                          onChange={(e) => updateLinkAt(index, linkIndex, { ...link, isVisible: e.target.checked })}
                        />
                        Visible
                      </label>
                      <RowActions
                        index={linkIndex}
                        count={column.links.length}
                        onMove={(direction) => updateAt(index, { ...column, links: moveItem(column.links, linkIndex, direction) })}
                        onRemove={() => updateAt(index, { ...column, links: column.links.filter((l) => l.id !== link.id) })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Label">
                      <input className={textInputClass()} value={link.label} onChange={(e) => updateLinkAt(index, linkIndex, { ...link, label: e.target.value })} />
                    </Field>
                    <Field label="Href">
                      <input className={textInputClass()} value={link.href} onChange={(e) => updateLinkAt(index, linkIndex, { ...link, href: e.target.value })} />
                    </Field>
                  </div>
                </div>
              ))}

              {column.links.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600">
                  No links in this column yet.
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {columns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No columns yet. Add one to start.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PaymentMethodsEditor({ methods, onChange }: { methods: string[]; onChange: (methods: string[]) => void }) {
  const updateAt = (index: number, value: string) => {
    const copy = methods.slice();
    copy[index] = value;
    onChange(copy);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Payment methods</div>
          <div className="text-xs text-slate-500">Strings used to render payment method chips/icons.</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => onChange([...methods, ''])}
        >
          <Plus className="h-4 w-4" /> Add method
        </button>
      </div>

      <div className="space-y-2">
        {methods.map((method, index) => (
          <div key={`${index}-${method}`} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <input className={textInputClass()} value={method} onChange={(e) => updateAt(index, e.target.value)} />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
              onClick={() => onChange(methods.filter((_, i) => i !== index))}
              aria-label="Remove payment method"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {methods.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No payment methods yet. Add one to start.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CertificatesEditor({ items, onChange }: { items: Array<{ id: string; name: string; description: string; theme: 'gold' | 'blue' | 'green' | 'orange'; isVisible: boolean }>; onChange: (items: any[]) => void }) {
  return (
    <SimpleNameListEditor
      title="Certificates"
      description="Certificates/assurances shown on the homepage."
      items={items}
      onChange={onChange}
      makeItem={() => ({ id: makeId('cert'), name: '', description: '', theme: 'gold', isVisible: true })}
      getLabel={(item) => item.name || 'Untitled certificate'}
      renderFields={(item, index, next) => (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Name">
            <input className={textInputClass()} value={item.name} onChange={(e) => next(index, { ...item, name: e.target.value })} />
          </Field>
          <Field label="Theme">
            <select className={textInputClass()} value={item.theme} onChange={(e) => next(index, { ...item, theme: e.target.value })}>
              <option value="gold">Gold</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <input className={textInputClass()} value={item.description} onChange={(e) => next(index, { ...item, description: e.target.value })} />
            </Field>
          </div>
        </div>
      )}
    />
  );
}

function StatsEditor({ items, onChange }: { items: Array<{ id: string; value: number; suffix: string; label: string; isVisible: boolean }>; onChange: (items: any[]) => void }) {
  return (
    <SimpleNameListEditor
      title="Stats"
      description="Homepage stats counters."
      items={items}
      onChange={onChange}
      makeItem={() => ({ id: makeId('stat'), value: 0, suffix: '', label: '', isVisible: true })}
      getLabel={(item) => item.label || 'Untitled stat'}
      renderFields={(item, index, next) => (
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Value">
            <input
              type="number"
              className={textInputClass()}
              value={Number.isFinite(item.value) ? item.value : 0}
              onChange={(e) => next(index, { ...item, value: Number(e.target.value) })}
            />
          </Field>
          <Field label="Suffix">
            <input className={textInputClass()} value={item.suffix} onChange={(e) => next(index, { ...item, suffix: e.target.value })} />
          </Field>
          <Field label="Label">
            <input className={textInputClass()} value={item.label} onChange={(e) => next(index, { ...item, label: e.target.value })} />
          </Field>
        </div>
      )}
    />
  );
}
