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
import { Field, SectionCard, ToggleField, textInputClass } from './AdminShell';
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
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">سجل الصور</div>
          <div className="text-xs text-gray-500">
            ربط الأكواد بعناوين صور الويب (على سبيل المثال hero-1)
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={entry.code} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <code className="w-20 shrink-0 rounded bg-gray-200 px-2 py-1 text-xs font-mono text-gray-800">
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
    'inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40';
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
    { id: 'images', label: 'معرض الصور', helper: 'صور البانر والأقسام' },
    { id: 'hero', label: 'البانر الرئيسي', helper: 'الشرائح المتحركة للصفحة الرئيسية' },
    { id: 'trust', label: 'شريط الموثوقية', helper: 'نقاط المزايا أسفل البانر' },
    { id: 'promo', label: 'البطاقات الترويجية', helper: 'شبكة العروض الترويجية' },
    { id: 'brands', label: 'العلامات التجارية', helper: 'قائمة العلامات التجارية للصفحة الرئيسية' },
    { id: 'certs', label: 'الشهادات والضمانات', helper: 'أيقونات الثقة والضمانات' },
    { id: 'stats', label: 'الإحصائيات', helper: 'عدادات الأرقام للصفحة الرئيسية' },
    { id: 'topbarSocials', label: 'التواصل الاجتماعي بالشريط العلوي', helper: 'أيقونات التواصل في أعلى الصفحة' },
    { id: 'navbar', label: 'القائمة الرئيسية', helper: 'روابط التصفح الأساسية' },
    { id: 'footerSocials', label: 'التواصل الاجتماعي أسفل الصفحة', helper: 'أيقونات التواصل أسفل الصفحة' },
    { id: 'footerContacts', label: 'بيانات الاتصال', helper: 'معلومات التواصل أسفل الصفحة' },
    { id: 'footerColumns', label: 'روابط أسفل الصفحة', helper: 'مجموعات الروابط (أعمدة الفوتر)' },
    { id: 'footerPolicies', label: 'سياسات المتجر', helper: 'روابط الشروط والأحكام' },
    { id: 'footerPayments', label: 'طرق الدفع', helper: 'أيقونات وسائل الدفع' },
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

  const mainTabs = [
    { id: 'general' as const, label: 'عام' },
    { id: 'homepage' as const, label: 'الصفحة الرئيسية' },
    { id: 'header' as const, label: 'الرأس والتنقل' },
    { id: 'footer' as const, label: 'التذييل' },
  ] as const;
  const [mainTab, setMainTab] = useState<'general' | 'homepage' | 'header' | 'footer'>('general');

  const homepageSections = advancedSections.filter((s) => ['images', 'hero', 'trust', 'promo', 'brands', 'certs', 'stats'].includes(s.id));
  const headerSections = advancedSections.filter((s) => ['images', 'topbarSocials', 'navbar'].includes(s.id));
  const footerSections = advancedSections.filter((s) => ['footerSocials', 'footerContacts', 'footerColumns', 'footerPolicies', 'footerPayments'].includes(s.id));

  const setMainTabWithSection = (tab: typeof mainTab) => {
    setMainTab(tab);
    if (tab === 'homepage' && !homepageSections.some((s) => s.id === advancedSection)) setAdvancedSection('hero');
    if (tab === 'header' && !headerSections.some((s) => s.id === advancedSection)) setAdvancedSection('topbarSocials');
    if (tab === 'footer' && !footerSections.some((s) => s.id === advancedSection)) setAdvancedSection('footerSocials');
  };

  const visibilityToggles = [
    { key: 'hero', label: 'البانر الرئيسي', checked: draft.home.hero.isVisible ?? true },
    { key: 'productsSection', label: 'المنتجات', checked: draft.home.productsSection.isVisible ?? true },
    { key: 'trustStrip', label: 'شريط الموثوقية', checked: draft.home.trustStrip.isVisible ?? true },
    { key: 'promoGrid', label: 'البطاقات الترويجية', checked: draft.home.promoGrid.isVisible ?? true },
    { key: 'brandsSection', label: 'العلامات التجارية', checked: draft.home.brandsSection.isVisible ?? true },
    { key: 'statsSection', label: 'الإحصائيات', checked: draft.home.statsSection.isVisible ?? true },
    { key: 'certsSection', label: 'الشهادات والضمانات', checked: draft.home.certsSection.isVisible ?? true },
    { key: 'servicesSection', label: 'الخدمات', checked: draft.home.servicesSection.isVisible ?? true },
    { key: 'blogSection', label: 'المدونة', checked: draft.home.blogSection.isVisible ?? true },
    { key: 'newsletterSection', label: 'القائمة البريدية', checked: draft.home.newsletterSection.isVisible ?? true },
    { key: 'appSection', label: 'تطبيق الجوال', checked: draft.home.appSection.isVisible ?? true },
    { key: 'dealsSection', label: 'العروض', checked: draft.home.dealsSection.isVisible ?? true },
    { key: 'categoriesSection', label: 'الأقسام', checked: draft.home.categoriesSection.isVisible ?? true },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">إعدادات المتجر</h2>
              <p className="mt-0.5 text-sm text-gray-500">تكوين الصفحة الرئيسية والرأس والتذييل والأقسام المحتوى</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
              onClick={() => void onPublish()}
              disabled={controller.isSaving}
            >
              <Save className="mr-2 inline h-4 w-4" />
              {controller.isSaving ? 'جاري النشر...' : 'نشر'}
            </button>
          </div>

          {/* Tab bar */}
          <div className="mt-4 flex gap-1 border-b border-gray-200 -mb-px">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMainTabWithSection(tab.id)}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  mainTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* General tab */}
          {mainTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">الإعدادات الأساسية</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="اسم الموقع">
                    <input className={textInputClass()} value={draft.header.logoTitle ?? ''} onChange={(e) => setField('header', 'logoTitle', e.target.value)} />
                  </Field>
                  <Field label="هاتف الاتصال">
                    <input className={textInputClass()} value={draft.topbar.phone ?? ''} onChange={(e) => setField('topbar', 'phone', e.target.value)} />
                  </Field>
                  <Field label="نص عنصر البحث">
                    <input className={textInputClass()} value={draft.header.searchPlaceholder ?? ''} onChange={(e) => setField('header', 'searchPlaceholder', e.target.value)} />
                  </Field>
                  <Field label="نص حقوق النسخ للتذييل">
                    <input className={textInputClass()} value={draft.footer.bottomText ?? ''} onChange={(e) => setField('footer', 'bottomText', e.target.value)} />
                  </Field>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">رؤية الأقسام</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visibilityToggles.map((t) => (
                    <ToggleField
                      key={t.key}
                      label={t.label}
                      checked={t.checked}
                      onChange={(v) => setField('home', t.key, v)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Homepage tab - sections sidebar + content */}
          {mainTab === 'homepage' && (
            <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
              <nav className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
                {homepageSections.map((s) => {
                  const active = advancedSection === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAdvancedSection(s.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        active ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-white/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </nav>
              <div className="min-w-0">
                {advancedSection !== 'images' ? (
                  <div className="mb-4">
                    <ToggleField
                      label="تمكين القسم"
                      description="إظهار/إخفاء هذا القسم على الصفحة الرئيسية."
                      checked={advancedEnabled}
                      onChange={(v) => setAdvancedEnabled(v)}
                    />
                  </div>
                ) : null}
                {advancedSection === 'images' && <ImageRegistryEditor />}
                {advancedSection === 'hero' && (
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">شرائح البانر الرئيسي</div>
                        <div className="text-xs text-gray-500">البطاقات المتحركة للبانر الرئيسي.</div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
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
                        <Plus className="h-4 w-4" /> إضافة شريحة
                      </button>
                    </div>

                    <div className="space-y-3">
                      {controller.heroSlides.map((slide, index) => (
                        <div key={slide.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-gray-900">{slide.title || 'شريحة بدون عنوان'}</div>
                              <div className="text-xs text-gray-500">ID: {slide.id}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={slide.isVisible}
                                  onChange={(e) => {
                                    const next = controller.heroSlides.slice();
                                    next[index] = { ...slide, isVisible: e.target.checked };
                                    controller.setHeroSlides(next);
                                  }}
                                />
                                مرئي
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
                            <Field label="العنوان العلوي">
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
                            <Field label="العنوان">
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
                              <Field label="الوصف">
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
                            <Field label="نص زر العمل الرئيسي">
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
                            <Field label="رابط زر العمل الرئيسي">
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
                            <Field label="نص زر العمل الثانوي">
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
                            <Field label="رابط زر العمل الثانوي">
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
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600">
                          لم تضف شرائح بعد. أضف واحدة للبدء.
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {advancedSection === 'trust' && (
                  <SimpleFeatureItemsEditor
                    title="شريط الموثوقية"
                    description="نقاط المزايا المعروضة أسفل البانر الرئيسي."
                    items={controller.trustItems}
                    onChange={controller.setTrustItems}
                  />
                )}

                {advancedSection === 'promo' && (
                  <PromoCardsEditor cards={controller.promoCards} onChange={controller.setPromoCards} />
                )}

                {advancedSection === 'brands' && (
                  <SimpleNameListEditor
                    title="العلامات التجارية"
                    description="قائمة العلامات التجارية المعروضة في الصفحة الرئيسية."
                    items={controller.brands}
                    onChange={controller.setBrands}
                    makeItem={() => ({ id: makeId('brand'), name: '', isVisible: true })}
                    getLabel={(item) => item.name || 'علامة تجارية بدون عنوان'}
                    renderFields={(item, index, next) => (
                      <Field label="الاسم">
                        <input
                          className={textInputClass()}
                          value={item.name}
                          onChange={(e) => next(index, { ...item, name: e.target.value })}
                        />
                      </Field>
                    )}
                  />
                )}

                {advancedSection === 'certs' && (
                  <CertificatesEditor items={controller.certificates} onChange={controller.setCertificates} />
                )}

                {advancedSection === 'stats' && (
                  <StatsEditor items={controller.stats} onChange={controller.setStats} />
                )}

              </div>
            </div>
          )
        }
          {/* Header & Nav tab */}
          {mainTab === 'header' && (
            <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
              <nav className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
                {headerSections.map((s) => {
                  const active = advancedSection === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAdvancedSection(s.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        active ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-white/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </nav>
              <div className="min-w-0">
                {advancedSection === 'images' && <ImageRegistryEditor />}
                {advancedSection === 'topbarSocials' && (
                  <LinksEditor title="التواصل الاجتماعي بالشريط العلوي" description="أيقونات التواصل الاجتماعي في أعلى الصفحة." links={controller.topbarSocialLinks} onChange={controller.setTopbarSocialLinks} />
                )}
                {advancedSection === 'navbar' && (
                  <LinksEditor title="القائمة الرئيسية" description="روابط التصفح الأساسية." links={controller.navbarItems} onChange={controller.setNavbarItems} />
                )}
              </div>
            </div>
          )}
          {/* Footer tab */}
          {mainTab === 'footer' && (
            <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
              <nav className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
                {footerSections.map((s) => {
                  const active = advancedSection === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAdvancedSection(s.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        active ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-white/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </nav>
              <div className="min-w-0">
                {advancedSection === 'footerSocials' && (
                  <LinksEditor title="وسائل التواصل في التذييل" description="أيقونات وسائل التواصل الاجتماعي في التذييل." links={controller.footerSocialLinks} onChange={controller.setFooterSocialLinks} />
                )}
                {advancedSection === 'footerContacts' && (
                  <FooterContactsEditor items={controller.footerContacts} onChange={controller.setFooterContacts} />
                )}
                {advancedSection === 'footerColumns' && (
                  <FooterColumnsEditor columns={controller.footerColumns} onChange={controller.setFooterColumns} />
                )}
                {advancedSection === 'footerPolicies' && (
                  <LinksEditor title="سياسات التذييل" description="روابط السياسة في شريط التذييل السفلي." links={controller.footerPolicies} onChange={controller.setFooterPolicies} />
                )}
                {advancedSection === 'footerPayments' && (
                  <PaymentMethodsEditor methods={controller.footerPayments} onChange={controller.setFooterPayments} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
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
      getLabel={(item) => item.title || 'عنصر بدون عنوان'}
      renderFields={(item, index, next) => (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="العنوان">
            <input className={textInputClass()} value={item.title} onChange={(e) => next(index, { ...item, title: e.target.value })} />
          </Field>
          <Field label="العنوان الفرعي">
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
          <Plus className="h-4 w-4" /> إضافة عنصر
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
                  مرئي
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
            لا توجد عناصر بعد. أضف واحدة للبدء.
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
          <div className="text-sm font-semibold text-slate-900">البطاقات الترويجية</div>
          <div className="text-xs text-slate-500">شبكة العروض الترويجية للصفحة الرئيسية.</div>
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
          <Plus className="h-4 w-4" /> إضافة بطاقة
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((card, index) => (
          <div key={card.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{card.title || 'بطاقة بدون عنوان'}</div>
                <div className="text-xs text-slate-500">ID: {card.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={card.isVisible}
                    onChange={(e) => updateAt(index, { ...card, isVisible: e.target.checked })}
                  />
                  مرئي
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
              <Field label="الحجم">
                <select className={textInputClass()} value={card.size} onChange={(e) => updateAt(index, { ...card, size: e.target.value as PromoCard['size'] })}>
                  <option value="main">رئيسي</option>
                  <option value="small">صغير</option>
                </select>
              </Field>
              <Field label="اللون">
                <select className={textInputClass()} value={card.theme} onChange={(e) => updateAt(index, { ...card, theme: e.target.value as PromoCard['theme'] })}>
                  <option value="orange">برتقالي</option>
                  <option value="green">أخضر</option>
                  <option value="blue">أزرق</option>
                  <option value="gold">ذهبي</option>
                  <option value="red">أحمر</option>
                </select>
              </Field>
              <Field label="الوسم">
                <input className={textInputClass()} value={card.tag} onChange={(e) => updateAt(index, { ...card, tag: e.target.value })} />
              </Field>
              <Field label="العنوان">
                <input className={textInputClass()} value={card.title} onChange={(e) => updateAt(index, { ...card, title: e.target.value })} />
              </Field>
              <Field label="العنوان الفرعي (اختياري)">
                <input className={textInputClass()} value={card.subtitle ?? ''} onChange={(e) => updateAt(index, { ...card, subtitle: e.target.value })} />
              </Field>
              <Field label="الرابط">
                <input className={textInputClass()} value={card.href} onChange={(e) => updateAt(index, { ...card, href: e.target.value })} />
              </Field>
            </div>
          </div>
        ))}
        {cards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-(--border) bg-(--d3) px-4 py-6 text-sm text-(--muted2)">
            لا توجد بطاقات ترويجية بعد. أضف واحدة للبدء.
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
          <Plus className="h-4 w-4" /> إضافة رابط
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={link.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{link.label || 'رابط بدون عنوان'}</div>
                <div className="text-xs text-slate-500">ID: {link.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={link.isVisible}
                    onChange={(e) => updateAt(index, { ...link, isVisible: e.target.checked })}
                  />
                  مرئي
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
              <Field label="العنوان">
                <input className={textInputClass()} value={link.label} onChange={(e) => updateAt(index, { ...link, label: e.target.value })} />
              </Field>
              <Field label="الرابط">
                <input className={textInputClass()} value={link.href} onChange={(e) => updateAt(index, { ...link, href: e.target.value })} />
              </Field>
              <Field label="البارك (اختياري)">
                <input className={textInputClass()} value={link.badge ?? ''} onChange={(e) => updateAt(index, { ...link, badge: e.target.value || undefined })} />
              </Field>
            </div>
          </div>
        ))}
        {links.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            لا توجد روابط بعد. أضف رابطاً للبدء.
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
          <div className="text-sm font-semibold text-slate-900">بيانات الاتصال</div>
          <div className="text-xs text-slate-500">معلومات التواصل في أسفل الصفحة.</div>
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
          <Plus className="h-4 w-4" /> إضافة بيانات اتصال
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{item.label || 'جهة اتصال بدون عنوان'}</div>
                <div className="text-xs text-slate-500">ID: {item.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={item.isVisible}
                    onChange={(e) => updateAt(index, { ...item, isVisible: e.target.checked })}
                  />
                  مرئي
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
              <Field label="العنوان">
                <input className={textInputClass()} value={item.label} onChange={(e) => updateAt(index, { ...item, label: e.target.value })} />
              </Field>
              <Field label="القيمة">
                <input className={textInputClass()} value={item.value} onChange={(e) => updateAt(index, { ...item, value: e.target.value })} />
              </Field>
              <Field label="الرابط (اختياري)">
                <input className={textInputClass()} value={item.href ?? ''} onChange={(e) => updateAt(index, { ...item, href: e.target.value || undefined })} />
              </Field>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            لا توجد بيانات اتصال بعد. أضف واحدة للبدء.
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
          <div className="text-sm font-semibold text-slate-900">روابط أسفل الصفحة</div>
          <div className="text-xs text-slate-500">مجموعات الروابط السفلية (كل عمود يحتوي على روابط).</div>
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
          <Plus className="h-4 w-4" /> إضافة عمود
        </button>
      </div>

      <div className="space-y-3">
        {columns.map((column, index) => (
          <div key={column.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{column.title || 'عمود بدون عنوان'}</div>
                <div className="text-xs text-slate-500">ID: {column.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={column.isVisible}
                    onChange={(e) => updateAt(index, { ...column, isVisible: e.target.checked })}
                  />
                  مرئي
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
              <Field label="العنوان">
                <input className={textInputClass()} value={column.title} onChange={(e) => updateAt(index, { ...column, title: e.target.value })} />
              </Field>
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={() => updateAt(index, { ...column, links: [...column.links, { id: makeId('link'), label: '', href: '', isVisible: true }] })}
                >
                  <Plus className="h-4 w-4" /> إضافة رابط
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {column.links.map((link, linkIndex) => (
                <div key={link.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{link.label || 'رابط بدون عنوان'}</div>
                      <div className="text-xs text-slate-500">ID: {link.id}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={link.isVisible}
                          onChange={(e) => updateLinkAt(index, linkIndex, { ...link, isVisible: e.target.checked })}
                        />
                        مرئي
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
                    <Field label="العنوان">
                      <input className={textInputClass()} value={link.label} onChange={(e) => updateLinkAt(index, linkIndex, { ...link, label: e.target.value })} />
                    </Field>
                    <Field label="الرابط">
                      <input className={textInputClass()} value={link.href} onChange={(e) => updateLinkAt(index, linkIndex, { ...link, href: e.target.value })} />
                    </Field>
                  </div>
                </div>
              ))}

              {column.links.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600">
                  لا توجد روابط في هذا العمود بعد.
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {columns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            لا توجد أعمدة بعد. أضف واحدة للبدء.
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
          <div className="text-sm font-semibold text-slate-900">طرق الدفع</div>
          <div className="text-xs text-slate-500">النصوص المستخدمة لعرض أيقونات طرق الدفع.</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => onChange([...methods, ''])}
        >
          <Plus className="h-4 w-4" /> إضافة طريقة دفع
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
            لا توجد طرق دفع بعد. أضف واحدة للبدء.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CertificatesEditor({ items, onChange }: { items: Array<{ id: string; name: string; description: string; theme: 'gold' | 'blue' | 'green' | 'orange'; isVisible: boolean }>; onChange: (items: any[]) => void }) {
  return (
    <SimpleNameListEditor
      title="الشهادات والضمانات"
      description="الشهادات وضمانات الثقة المعروضة في الصفحة الرئيسية."
      items={items}
      onChange={onChange}
      makeItem={() => ({ id: makeId('cert'), name: '', description: '', theme: 'gold', isVisible: true })}
      getLabel={(item) => item.name || 'شهادة بدون عنوان'}
      renderFields={(item, index, next) => (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الاسم">
            <input className={textInputClass()} value={item.name} onChange={(e) => next(index, { ...item, name: e.target.value })} />
          </Field>
          <Field label="النمط">
            <select className={textInputClass()} value={item.theme} onChange={(e) => next(index, { ...item, theme: e.target.value })}>
              <option value="gold">ذهبي</option>
              <option value="blue">أزرق</option>
              <option value="green">أخضر</option>
              <option value="orange">برتقالي</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="الوصف">
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
      title="الإحصائيات"
      description="عدادات الأرقام في الصفحة الرئيسية."
      items={items}
      onChange={onChange}
      makeItem={() => ({ id: makeId('stat'), value: 0, suffix: '', label: '', isVisible: true })}
      getLabel={(item) => item.label || 'إحصائية بدون عنوان'}
      renderFields={(item, index, next) => (
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="القيمة">
            <input
              type="number"
              className={textInputClass()}
              value={Number.isFinite(item.value) ? item.value : 0}
              onChange={(e) => next(index, { ...item, value: Number(e.target.value) })}
            />
          </Field>
          <Field label="اللاحقة">
            <input className={textInputClass()} value={item.suffix} onChange={(e) => next(index, { ...item, suffix: e.target.value })} />
          </Field>
          <Field label="العنوان">
            <input className={textInputClass()} value={item.label} onChange={(e) => next(index, { ...item, label: e.target.value })} />
          </Field>
        </div>
      )}
    />
  );
}
