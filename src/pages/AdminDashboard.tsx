import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { isSupabaseConfigured } from '../supabaseClient';
import type { AdminDashboardData, BlogPost, Category, Order, OrderStatus, Product, Service, SiteSettings } from '../types';
import { formatCurrency } from '../utils/catalog';
import { ORDER_STATUS_LABELS } from '../utils/orders';
import { EmptyState, Field, MetricCard, Panel, SectionCard, ToggleField, areaClass, textInputClass } from '../components/admin/AdminShell';
import {
  BlogDraftForm,
  CategoryDraftForm,
  ProductDraftForm,
  ServiceDraftForm,
  makeEmptyBlogPost,
  makeEmptyCategory,
  makeEmptyProduct,
  makeEmptyService,
} from '../components/admin/CatalogForms';

type DashboardTab = 'overview' | 'storefront' | 'products' | 'categories' | 'services' | 'blog' | 'orders' | 'quotes' | 'leads' | 'customers';
type CopySectionKey =
  | 'categoriesSection'
  | 'productsSection'
  | 'servicesSection'
  | 'brandsSection'
  | 'dealsSection'
  | 'certsSection'
  | 'statsSection'
  | 'blogSection'
  | 'newsletterSection'
  | 'appSection';

const tabs: Array<{ id: DashboardTab; label: string; description: string }> = [
  { id: 'overview', label: 'Overview', description: 'Live commercial snapshot' },
  { id: 'storefront', label: 'Storefront', description: 'Visible marketplace content and navigation' },
  { id: 'products', label: 'Products', description: 'Add, edit, hide, or delete products' },
  { id: 'categories', label: 'Categories', description: 'Control visible category structure' },
  { id: 'services', label: 'Services', description: 'Manage service content and visibility' },
  { id: 'blog', label: 'Blog', description: 'Publish and control knowledge content' },
  { id: 'orders', label: 'Orders', description: 'Operational queue and status updates' },
  { id: 'quotes', label: 'Quotes', description: 'Incoming RFQs from the site' },
  { id: 'leads', label: 'B2B', description: 'Company registrations and leads' },
  { id: 'customers', label: 'Customers', description: 'Recent customer profiles' },
];

const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function stringifyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseJson<T>(value: string, label: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`Invalid JSON in ${label}.`);
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings, saveSettings, isLoading: isSettingsLoading } = useSiteContent();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [storefrontDraft, setStorefrontDraft] = useState<SiteSettings>(settings);
  const [heroJson, setHeroJson] = useState(stringifyJson(settings.home.hero.slides));
  const [trustJson, setTrustJson] = useState(stringifyJson(settings.home.trustStrip.items));
  const [promoJson, setPromoJson] = useState(stringifyJson(settings.home.promoGrid.cards));
  const [brandsJson, setBrandsJson] = useState(stringifyJson(settings.home.brandsSection.items));
  const [certsJson, setCertsJson] = useState(stringifyJson(settings.home.certsSection.items));
  const [statsJson, setStatsJson] = useState(stringifyJson(settings.home.statsSection.items));
  const [topbarSocialJson, setTopbarSocialJson] = useState(stringifyJson(settings.topbar.socialLinks));
  const [navbarItemsJson, setNavbarItemsJson] = useState(stringifyJson(settings.navbar.navItems));
  const [footerSocialJson, setFooterSocialJson] = useState(stringifyJson(settings.footer.socialLinks));
  const [footerColumnsJson, setFooterColumnsJson] = useState(stringifyJson(settings.footer.columns));
  const [footerContactsJson, setFooterContactsJson] = useState(stringifyJson(settings.footer.contactItems));
  const [footerPoliciesJson, setFooterPoliciesJson] = useState(stringifyJson(settings.footer.policyLinks));
  const [footerPaymentsJson, setFooterPaymentsJson] = useState(stringifyJson(settings.footer.paymentMethods));
  const [productDraft, setProductDraft] = useState<Product>(makeEmptyProduct('safety'));
  const [categoryDraft, setCategoryDraft] = useState<Category>(makeEmptyCategory());
  const [serviceDraft, setServiceDraft] = useState<Service>(makeEmptyService('safety'));
  const [postDraft, setPostDraft] = useState<BlogPost>(makeEmptyBlogPost());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    setStorefrontDraft(settings);
    setHeroJson(stringifyJson(settings.home.hero.slides));
    setTrustJson(stringifyJson(settings.home.trustStrip.items));
    setPromoJson(stringifyJson(settings.home.promoGrid.cards));
    setBrandsJson(stringifyJson(settings.home.brandsSection.items));
    setCertsJson(stringifyJson(settings.home.certsSection.items));
    setStatsJson(stringifyJson(settings.home.statsSection.items));
    setTopbarSocialJson(stringifyJson(settings.topbar.socialLinks));
    setNavbarItemsJson(stringifyJson(settings.navbar.navItems));
    setFooterSocialJson(stringifyJson(settings.footer.socialLinks));
    setFooterColumnsJson(stringifyJson(settings.footer.columns));
    setFooterContactsJson(stringifyJson(settings.footer.contactItems));
    setFooterPoliciesJson(stringifyJson(settings.footer.policyLinks));
    setFooterPaymentsJson(stringifyJson(settings.footer.paymentMethods));
  }, [settings]);

  const loadWorkspace = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardData, productList, categoryList, serviceList, postList] = await Promise.all([
        api.admin.getDashboard(),
        api.products.admin.listAll(),
        api.categories.admin.listAll(),
        api.services.admin.listAll(),
        api.blog.admin.listAll(),
      ]);
      setDashboard(dashboardData);
      setProducts(productList);
      setCategories(categoryList);
      setServices(serviceList);
      setPosts(postList);
      setProductDraft((current) => (current.id ? current : makeEmptyProduct(categoryList[0]?.slug ?? 'safety')));
      setServiceDraft((current) => (current.id ? current : makeEmptyService(categoryList[0]?.slug ?? 'safety')));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to load the admin workspace.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkspace();
  }, []);

  const summaryMetrics = useMemo(() => {
    if (!dashboard?.metrics) {
      return [];
    }
    return [
      { label: 'Revenue', value: formatCurrency(dashboard.metrics.totalRevenue), helper: `${dashboard.metrics.orderCount} tracked orders` },
      { label: 'Customers', value: String(dashboard.metrics.customerCount), helper: 'Profiles in CRM' },
      { label: 'Quotes', value: String(dashboard.metrics.quoteCount), helper: 'Open pricing opportunities' },
      { label: 'B2B leads', value: String(dashboard.metrics.b2bLeadCount), helper: 'Company registrations' },
      { label: 'Newsletter', value: String(dashboard.metrics.newsletterCount), helper: 'Subscribed contacts' },
      { label: 'Mode', value: isSupabaseConfigured() ? 'Supabase' : 'Demo', helper: isSupabaseConfigured() ? 'Remote database live' : 'Fallback storage active' },
    ];
  }, [dashboard]);

  const copySections: Array<{ key: CopySectionKey; section: SiteSettings['home'][CopySectionKey] }> = [
    { key: 'categoriesSection', section: storefrontDraft.home.categoriesSection },
    { key: 'productsSection', section: storefrontDraft.home.productsSection },
    { key: 'servicesSection', section: storefrontDraft.home.servicesSection },
    { key: 'brandsSection', section: storefrontDraft.home.brandsSection },
    { key: 'dealsSection', section: storefrontDraft.home.dealsSection },
    { key: 'certsSection', section: storefrontDraft.home.certsSection },
    { key: 'statsSection', section: storefrontDraft.home.statsSection },
    { key: 'blogSection', section: storefrontDraft.home.blogSection },
    { key: 'newsletterSection', section: storefrontDraft.home.newsletterSection },
    { key: 'appSection', section: storefrontDraft.home.appSection },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleSaveStorefront = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const nextSettings: SiteSettings = {
        ...storefrontDraft,
        topbar: { ...storefrontDraft.topbar, socialLinks: parseJson(topbarSocialJson, 'topbar social links') },
        navbar: { ...storefrontDraft.navbar, navItems: parseJson(navbarItemsJson, 'navbar items') },
        home: {
          ...storefrontDraft.home,
          hero: { ...storefrontDraft.home.hero, slides: parseJson(heroJson, 'hero slides') },
          trustStrip: { ...storefrontDraft.home.trustStrip, items: parseJson(trustJson, 'trust strip items') },
          promoGrid: { ...storefrontDraft.home.promoGrid, cards: parseJson(promoJson, 'promo cards') },
          brandsSection: { ...storefrontDraft.home.brandsSection, items: parseJson(brandsJson, 'brands') },
          certsSection: { ...storefrontDraft.home.certsSection, items: parseJson(certsJson, 'certificates') },
          statsSection: { ...storefrontDraft.home.statsSection, items: parseJson(statsJson, 'stats') },
        },
        footer: {
          ...storefrontDraft.footer,
          socialLinks: parseJson(footerSocialJson, 'footer social links'),
          columns: parseJson(footerColumnsJson, 'footer columns'),
          contactItems: parseJson(footerContactsJson, 'footer contact items'),
          policyLinks: parseJson(footerPoliciesJson, 'footer policy links'),
          paymentMethods: parseJson(footerPaymentsJson, 'footer payment methods'),
        },
      };
      const saved = await saveSettings(nextSettings);
      setStorefrontDraft(saved);
      setNotice('Storefront settings saved.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to save storefront settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveCatalogEntity = async (type: 'product' | 'category' | 'service' | 'post') => {
    setIsSaving(true);
    setError(null);
    try {
      if (type === 'product') {
        const saved = productDraft.id && products.some((item) => item.id === productDraft.id)
          ? await api.products.admin.update(productDraft.id, productDraft)
          : await api.products.admin.create(productDraft);
        setProductDraft(saved);
        setNotice(`Product ${saved.title} saved.`);
      }
      if (type === 'category') {
        const saved = categoryDraft.id && categories.some((item) => item.id === categoryDraft.id)
          ? await api.categories.admin.update(categoryDraft.id, categoryDraft)
          : await api.categories.admin.create(categoryDraft);
        setCategoryDraft(saved);
        setNotice(`Category ${saved.name} saved.`);
      }
      if (type === 'service') {
        const saved = serviceDraft.id && services.some((item) => item.id === serviceDraft.id)
          ? await api.services.admin.update(serviceDraft.id, serviceDraft)
          : await api.services.admin.create(serviceDraft);
        setServiceDraft(saved);
        setNotice(`Service ${saved.title} saved.`);
      }
      if (type === 'post') {
        const saved = postDraft.id && posts.some((item) => item.id === postDraft.id)
          ? await api.blog.admin.update(postDraft.id, postDraft)
          : await api.blog.admin.create(postDraft);
        setPostDraft(saved);
        setNotice(`Blog post ${saved.title} saved.`);
      }
      await loadWorkspace();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to save catalog item.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCatalogEntity = async (type: 'product' | 'category' | 'service' | 'post') => {
    setIsSaving(true);
    setError(null);
    try {
      if (type === 'product' && productDraft.id) {
        await api.products.admin.delete(productDraft.id);
        setProductDraft(makeEmptyProduct(categories[0]?.slug ?? 'safety'));
      }
      if (type === 'category' && categoryDraft.id) {
        await api.categories.admin.delete(categoryDraft.id);
        setCategoryDraft(makeEmptyCategory());
      }
      if (type === 'service' && serviceDraft.id) {
        await api.services.admin.delete(serviceDraft.id);
        setServiceDraft(makeEmptyService(categories[0]?.slug ?? 'safety'));
      }
      if (type === 'post' && postDraft.id) {
        await api.blog.admin.delete(postDraft.id);
        setPostDraft(makeEmptyBlogPost());
      }
      await loadWorkspace();
      setNotice('Entry deleted.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to delete catalog item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrderStatusUpdate = async (order: Order, status: OrderStatus) => {
    if (order.status === status) return;
    setUpdatingOrderId(order.id);
    setError(null);
    try {
      await api.orders.updateStatus(order.id, status);
      await loadWorkspace();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryMetrics.map((item) => <MetricCard key={item.label} {...item} />)}
      </div>
      <Panel title="Latest orders" eyebrow="Operations">
        {!dashboard?.recentOrders.length ? <EmptyState title="No orders yet" description="New orders will appear here once customers start checking out." /> : (
          <div className="space-y-3">
            {dashboard.recentOrders.map((order) => (
              <div key={order.id} className="grid gap-3 rounded-[22px] border border-white/8 bg-white/3 px-4 py-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_180px] md:items-center">
                <div><p className="font-bold text-white">{order.orderNumber}</p><p className="text-sm text-(--muted2)">{formatDate(order.createdAt)}</p></div>
                <div><p className="text-sm text-(--muted2)">Total</p><p className="font-bold text-white">{formatCurrency(order.total)}</p></div>
                <div><p className="text-sm text-(--muted2)">Status</p><p className="font-semibold text-white">{ORDER_STATUS_LABELS[order.status]}</p></div>
                <select className={textInputClass()} value={order.status} disabled={updatingOrderId === order.id} onChange={(event) => void handleOrderStatusUpdate(order, event.target.value as OrderStatus)}>
                  {orderStatuses.map((status) => <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );

  const renderCatalogPanel = (
    title: string,
    items: Array<Product | Category | Service | BlogPost>,
    onCreate: () => void,
    onSelect: (item: Product | Category | Service | BlogPost) => void,
    form: ReactNode,
    onSave: () => void,
    onDelete: () => void,
  ) => (
    <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
      <Panel title={title} eyebrow="List" actions={<button type="button" className="btn-ghost" onClick={onCreate}>Add new</button>}>
        <div className="space-y-3">
          {!items.length ? <EmptyState title={`No ${title.toLowerCase()} yet`} description="Create the first one from the editor." /> : items.map((item) => (
            <button key={item.id} type="button" className="w-full rounded-[20px] border border-white/8 bg-white/3 px-4 py-4 text-left hover:border-white/16 hover:bg-white/5" onClick={() => onSelect(item)}>
              <p className="font-bold text-white">{'name' in item ? item.name : item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-(--muted2)">{item.slug}</p>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Editor" eyebrow="CRUD" actions={<div className="flex gap-3"><button type="button" className="btn-ghost" onClick={onDelete}>Delete</button><button type="button" className="btn-fire" disabled={isSaving} onClick={onSave}>{isSaving ? 'Saving...' : 'Save'}</button></div>}>
        {form}
      </Panel>
    </div>
  );

  const renderOrdersPanel = () => (
    <Panel title="Order control" eyebrow="Operations">
      {!dashboard?.recentOrders.length ? <EmptyState title="No orders yet" description="New orders will appear here once customers start checking out." /> : (
        <div className="space-y-3">
          {dashboard.recentOrders.map((order) => (
            <div key={order.id} className="grid gap-3 rounded-[22px] border border-white/8 bg-white/3 px-4 py-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_180px] md:items-center">
              <div><p className="font-bold text-white">{order.orderNumber}</p><p className="text-sm text-(--muted2)">{formatDate(order.createdAt)}</p></div>
              <div><p className="text-sm text-(--muted2)">Total</p><p className="font-bold text-white">{formatCurrency(order.total)}</p></div>
              <div><p className="text-sm text-(--muted2)">Status</p><p className="font-semibold text-white">{ORDER_STATUS_LABELS[order.status]}</p></div>
              <select className={textInputClass()} value={order.status} disabled={updatingOrderId === order.id} onChange={(event) => void handleOrderStatusUpdate(order, event.target.value as OrderStatus)}>
                {orderStatuses.map((status) => <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  if (isLoading || isSettingsLoading) {
    return <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-[24px] bg-white/5" />)}</div></div>;
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1700px] px-4 py-5 text-left md:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,16,25,0.94),rgba(7,10,16,0.94))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="border-b border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-6 md:px-7 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-(--o2)">AL-RAYAN ADMIN</p>
              <h1 className="text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">Full marketplace control at /admin</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-(--muted2) md:text-base">Control the visible storefront, catalog entities, and inbound sales pipeline from one admin surface.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/" className="btn-ghost">Open store</Link>
              <button type="button" onClick={() => void loadWorkspace()} className="btn-ghost">Refresh</button>
              <button type="button" onClick={handleSignOut} className="btn-fire">Sign out</button>
            </div>
          </div>
          {error ? <div className="mt-5 rounded-[22px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
          {notice ? <div className="mt-3 rounded-[22px] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{notice}</div> : null}
        </div>
        <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-white/8 px-4 py-5 lg:border-b-0 lg:border-r lg:px-5">
            <div className="rounded-[26px] border border-white/8 bg-white/3 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--muted2)">Workspace</p>
              <p className="mt-3 text-lg font-bold text-white">{user?.name ?? 'Admin user'}</p>
              <p className="mt-1 text-sm text-(--muted2)">{user?.email ?? 'No email available'}</p>
            </div>
            <div className="mt-4 space-y-2">
              {tabs.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all ${activeTab === tab.id ? 'border-[rgba(255,107,0,0.22)] bg-[rgba(255,107,0,0.1)] text-white' : 'border-white/8 bg-white/3 text-(--chrome)'}`}>
                  <p className="text-sm font-bold uppercase tracking-[0.18em]">{tab.label}</p>
                  <p className="mt-1 text-xs leading-6 text-(--muted2)">{tab.description}</p>
                </button>
              ))}
            </div>
          </aside>
          <main className="px-4 py-5 md:px-5 lg:px-6">
            {activeTab === 'overview' ? renderOverview() : null}
            {activeTab === 'storefront' ? (
              <Panel title="Storefront settings" eyebrow="CMS" actions={<button type="button" className="btn-fire" disabled={isSaving} onClick={() => void handleSaveStorefront()}>{isSaving ? 'Saving...' : 'Save storefront'}</button>}>
                <div className="space-y-6">
                  <SectionCard title="Core text and visibility">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Topbar location"><input className={textInputClass()} value={storefrontDraft.topbar.location} onChange={(event) => setStorefrontDraft({ ...storefrontDraft, topbar: { ...storefrontDraft.topbar, location: event.target.value } })} /></Field>
                      <Field label="Topbar phone"><input className={textInputClass()} value={storefrontDraft.topbar.phone} onChange={(event) => setStorefrontDraft({ ...storefrontDraft, topbar: { ...storefrontDraft.topbar, phone: event.target.value } })} /></Field>
                      <Field label="Header search"><input className={textInputClass()} value={storefrontDraft.header.searchPlaceholder} onChange={(event) => setStorefrontDraft({ ...storefrontDraft, header: { ...storefrontDraft.header, searchPlaceholder: event.target.value } })} /></Field>
                      <Field label="Footer bottom text"><input className={textInputClass()} value={storefrontDraft.footer.bottomText} onChange={(event) => setStorefrontDraft({ ...storefrontDraft, footer: { ...storefrontDraft.footer, bottomText: event.target.value } })} /></Field>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <ToggleField label="Show topbar" checked={storefrontDraft.topbar.isVisible} onChange={(checked) => setStorefrontDraft({ ...storefrontDraft, topbar: { ...storefrontDraft.topbar, isVisible: checked } })} />
                      <ToggleField label="Show hero" checked={storefrontDraft.home.hero.isVisible} onChange={(checked) => setStorefrontDraft({ ...storefrontDraft, home: { ...storefrontDraft.home, hero: { ...storefrontDraft.home.hero, isVisible: checked } } })} />
                      <ToggleField label="Show trust strip" checked={storefrontDraft.home.trustStrip.isVisible} onChange={(checked) => setStorefrontDraft({ ...storefrontDraft, home: { ...storefrontDraft.home, trustStrip: { ...storefrontDraft.home.trustStrip, isVisible: checked } } })} />
                      <ToggleField label="Show promo grid" checked={storefrontDraft.home.promoGrid.isVisible} onChange={(checked) => setStorefrontDraft({ ...storefrontDraft, home: { ...storefrontDraft.home, promoGrid: { ...storefrontDraft.home.promoGrid, isVisible: checked } } })} />
                    </div>
                  </SectionCard>
                  <SectionCard title="Section copy">
                    <div className="grid gap-4 xl:grid-cols-2">
                      {copySections.map(({ key, section }) => (
                        <div key={key} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                          <ToggleField label={key} checked={section.isVisible} onChange={(checked) => setStorefrontDraft({ ...storefrontDraft, home: { ...storefrontDraft.home, [key]: { ...section, isVisible: checked } } })} />
                          <div className="mt-3 space-y-3">
                            <Field label="Title"><input className={textInputClass()} value={section.title} onChange={(event) => setStorefrontDraft({ ...storefrontDraft, home: { ...storefrontDraft.home, [key]: { ...section, title: event.target.value } } })} /></Field>
                            <Field label="Subtitle"><textarea className={areaClass} value={section.subtitle} onChange={(event) => setStorefrontDraft({ ...storefrontDraft, home: { ...storefrontDraft.home, [key]: { ...section, subtitle: event.target.value } } })} /></Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                  <SectionCard title="Repeatable visible items as JSON">
                    <p className="text-sm text-(--muted2)">Add, delete, reorder, or toggle items by editing these JSON arrays directly.</p>
                    <div className="grid gap-4 xl:grid-cols-2">
                      <Field label="Hero slides"><textarea className={`${areaClass} min-h-[220px]`} value={heroJson} onChange={(event) => setHeroJson(event.target.value)} /></Field>
                      <Field label="Trust strip items"><textarea className={`${areaClass} min-h-[220px]`} value={trustJson} onChange={(event) => setTrustJson(event.target.value)} /></Field>
                      <Field label="Promo cards"><textarea className={`${areaClass} min-h-[220px]`} value={promoJson} onChange={(event) => setPromoJson(event.target.value)} /></Field>
                      <Field label="Brands"><textarea className={`${areaClass} min-h-[220px]`} value={brandsJson} onChange={(event) => setBrandsJson(event.target.value)} /></Field>
                      <Field label="Certificates"><textarea className={`${areaClass} min-h-[220px]`} value={certsJson} onChange={(event) => setCertsJson(event.target.value)} /></Field>
                      <Field label="Stats"><textarea className={`${areaClass} min-h-[220px]`} value={statsJson} onChange={(event) => setStatsJson(event.target.value)} /></Field>
                    </div>
                  </SectionCard>
                  <SectionCard title="Navigation and footer structures as JSON">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <Field label="Topbar social links"><textarea className={`${areaClass} min-h-[200px]`} value={topbarSocialJson} onChange={(event) => setTopbarSocialJson(event.target.value)} /></Field>
                      <Field label="Navbar items"><textarea className={`${areaClass} min-h-[200px]`} value={navbarItemsJson} onChange={(event) => setNavbarItemsJson(event.target.value)} /></Field>
                      <Field label="Footer social links"><textarea className={`${areaClass} min-h-[200px]`} value={footerSocialJson} onChange={(event) => setFooterSocialJson(event.target.value)} /></Field>
                      <Field label="Footer contact items"><textarea className={`${areaClass} min-h-[200px]`} value={footerContactsJson} onChange={(event) => setFooterContactsJson(event.target.value)} /></Field>
                      <Field label="Footer columns"><textarea className={`${areaClass} min-h-[240px]`} value={footerColumnsJson} onChange={(event) => setFooterColumnsJson(event.target.value)} /></Field>
                      <Field label="Footer policy links"><textarea className={`${areaClass} min-h-[200px]`} value={footerPoliciesJson} onChange={(event) => setFooterPoliciesJson(event.target.value)} /></Field>
                      <Field label="Footer payment methods"><textarea className={`${areaClass} min-h-[200px]`} value={footerPaymentsJson} onChange={(event) => setFooterPaymentsJson(event.target.value)} /></Field>
                    </div>
                  </SectionCard>
                </div>
              </Panel>
            ) : null}
            {activeTab === 'products' ? renderCatalogPanel('Products', products, () => setProductDraft(makeEmptyProduct(categories[0]?.slug ?? 'safety')), (item) => setProductDraft(item as Product), <ProductDraftForm draft={productDraft} categories={categories} onChange={setProductDraft} />, () => void saveCatalogEntity('product'), () => void deleteCatalogEntity('product')) : null}
            {activeTab === 'categories' ? renderCatalogPanel('Categories', categories, () => setCategoryDraft(makeEmptyCategory()), (item) => setCategoryDraft(item as Category), <CategoryDraftForm draft={categoryDraft} onChange={setCategoryDraft} />, () => void saveCatalogEntity('category'), () => void deleteCatalogEntity('category')) : null}
            {activeTab === 'services' ? renderCatalogPanel('Services', services, () => setServiceDraft(makeEmptyService(categories[0]?.slug ?? 'safety')), (item) => setServiceDraft(item as Service), <ServiceDraftForm draft={serviceDraft} categories={categories} onChange={setServiceDraft} />, () => void saveCatalogEntity('service'), () => void deleteCatalogEntity('service')) : null}
            {activeTab === 'blog' ? renderCatalogPanel('Blog posts', posts, () => setPostDraft(makeEmptyBlogPost()), (item) => setPostDraft(item as BlogPost), <BlogDraftForm draft={postDraft} onChange={setPostDraft} />, () => void saveCatalogEntity('post'), () => void deleteCatalogEntity('post')) : null}
            {activeTab === 'orders' ? renderOrdersPanel() : null}
            {activeTab === 'quotes' ? <Panel title="Quote requests" eyebrow="Sales">{!dashboard?.recentQuotes.length ? <EmptyState title="No quote requests" description="Quotes from the public site will appear here." /> : <div className="space-y-3">{dashboard.recentQuotes.map((quote) => <div key={quote.id} className="rounded-[22px] border border-white/8 bg-white/3 p-4 text-sm text-(--muted2)"><p className="font-bold text-white">{quote.company}</p><p>{quote.contactName} | {quote.email}</p><p className="mt-2">{quote.description}</p></div>)}</div>}</Panel> : null}
            {activeTab === 'leads' ? <Panel title="B2B leads" eyebrow="Business">{!dashboard?.recentB2BRegistrations.length ? <EmptyState title="No B2B registrations" description="Business onboarding requests will appear here." /> : <div className="space-y-3">{dashboard.recentB2BRegistrations.map((lead) => <div key={lead.id} className="rounded-[22px] border border-white/8 bg-white/3 p-4 text-sm text-(--muted2)"><p className="font-bold text-white">{lead.companyName}</p><p>{lead.contactName} | {lead.email}</p><p className="mt-2">{lead.requirements}</p></div>)}</div>}</Panel> : null}
            {activeTab === 'customers' ? <Panel title="Customer profiles" eyebrow="CRM">{!dashboard?.customers.length ? <EmptyState title="No customer profiles" description="Registered customers will appear here." /> : <div className="grid gap-3 md:grid-cols-2">{dashboard.customers.map((customer) => <div key={customer.id} className="rounded-[22px] border border-white/8 bg-white/3 p-4"><p className="font-bold text-white">{customer.name}</p><p className="text-sm text-(--muted2)">{customer.email}</p></div>)}</div>}</Panel> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
