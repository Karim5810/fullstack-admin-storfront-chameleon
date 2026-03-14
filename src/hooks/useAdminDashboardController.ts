import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import {
  makeEmptyBlogPost,
  makeEmptyCategory,
  makeEmptyProduct,
  makeEmptyService,
} from '../components/admin/CatalogForms';
import type {
  AdminDashboardData,
  B2BRegistration,
  BlogPost,
  BrandItem,
  Category,
  CertificateItem,
  FooterColumn,
  FooterContactItem,
  HeroSlide,
  Order,
  OrderStatus,
  PromoCard,
  Product,
  QuoteRequest,
  Service,
  SiteLink,
  SiteSocialLink,
  SiteFeatureItem,
  SiteSettings,
  StatItem,
} from '../types';
import { ensureSlug, formatCurrency } from '../utils/catalog';
import { ORDER_STATUS_LABELS } from '../utils/orders';

export type DashboardTab =
  | 'overview'
  | 'storefront'
  | 'products'
  | 'categories'
  | 'services'
  | 'blog'
  | 'orders'
  | 'quotes'
  | 'leads'
  | 'customers';

export type VisibilityFilter = 'all' | 'visible' | 'hidden';
export type CatalogEntityType = 'product' | 'category' | 'service' | 'post';
export type CatalogEntity = Product | Category | Service | BlogPost;
export type CopySectionKey =
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

type UseAdminDashboardControllerArgs = {
  settings: SiteSettings;
  saveSettings: (settings: SiteSettings) => Promise<SiteSettings>;
};

function getEntityTitle(item: CatalogEntity) {
  return 'name' in item ? item.name : item.title;
}

function getEntityDescription(item: CatalogEntity) {
  if ('excerpt' in item) {
    return item.excerpt;
  }

  return item.description ?? '';
}

function getEntityIsVisible(item: CatalogEntity) {
  return item.isActive !== false;
}

function getDraftSeed(type: CatalogEntityType, categories: Category[]) {
  const fallbackCategory = categories[0]?.slug ?? 'safety';

  switch (type) {
    case 'product':
      return makeEmptyProduct(fallbackCategory);
    case 'category':
      return makeEmptyCategory();
    case 'service':
      return makeEmptyService(fallbackCategory);
    case 'post':
      return makeEmptyBlogPost();
  }
}

function normalizeCatalogDraft(type: CatalogEntityType, draft: CatalogEntity): CatalogEntity {
  switch (type) {
    case 'product': {
      const product = draft as Product;
      return {
        ...product,
        slug: ensureSlug(product.slug, product.title),
      };
    }
    case 'category': {
      const category = draft as Category;
      return {
        ...category,
        slug: ensureSlug(category.slug, category.name),
      };
    }
    case 'service': {
      const service = draft as Service;
      const slug = ensureSlug(service.slug, service.title);
      const shouldRefreshLink = !service.link || service.link === '/services/' || service.link === `/services/${service.slug}`;

      return {
        ...service,
        slug,
        link: shouldRefreshLink ? `/services/${slug}` : service.link,
      };
    }
    case 'post': {
      const post = draft as BlogPost;
      return {
        ...post,
        slug: ensureSlug(post.slug, post.title),
      };
    }
  }
}

function getNormalizedItemSlug(item: CatalogEntity) {
  return ensureSlug(item.slug, getEntityTitle(item));
}

export function useAdminDashboardController({
  settings,
  saveSettings,
}: UseAdminDashboardControllerArgs) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [storefrontDraft, setStorefrontDraft] = useState<SiteSettings>(settings);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(settings.home.hero.slides);
  const [trustItems, setTrustItems] = useState<SiteFeatureItem[]>(settings.home.trustStrip.items);
  const [promoCards, setPromoCards] = useState<PromoCard[]>(settings.home.promoGrid.cards);
  const [brands, setBrands] = useState<BrandItem[]>(settings.home.brandsSection.items);
  const [certificates, setCertificates] = useState<CertificateItem[]>(settings.home.certsSection.items);
  const [stats, setStats] = useState<StatItem[]>(settings.home.statsSection.items);
  const [topbarSocialLinks, setTopbarSocialLinks] = useState<SiteSocialLink[]>(settings.topbar.socialLinks);
  const [navbarItems, setNavbarItems] = useState<SiteLink[]>(settings.navbar.navItems);
  const [footerSocialLinks, setFooterSocialLinks] = useState<SiteSocialLink[]>(settings.footer.socialLinks);
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>(settings.footer.columns);
  const [footerContacts, setFooterContacts] = useState<FooterContactItem[]>(settings.footer.contactItems);
  const [footerPolicies, setFooterPolicies] = useState<SiteLink[]>(settings.footer.policyLinks);
  const [footerPayments, setFooterPayments] = useState<string[]>(settings.footer.paymentMethods);

  const [productDraft, setProductDraft] = useState<Product>(makeEmptyProduct('safety'));
  const [categoryDraft, setCategoryDraft] = useState<Category>(makeEmptyCategory());
  const [serviceDraft, setServiceDraft] = useState<Service>(makeEmptyService('safety'));
  const [postDraft, setPostDraft] = useState<BlogPost>(makeEmptyBlogPost());

  const [entitySearch, setEntitySearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [quickToggleKey, setQuickToggleKey] = useState<string | null>(null);

  const deferredEntitySearch = useDeferredValue(entitySearch.trim().toLowerCase());

  const syncStorefrontState = (nextSettings: SiteSettings) => {
    setStorefrontDraft(nextSettings);
    setHeroSlides(nextSettings.home.hero.slides);
    setTrustItems(nextSettings.home.trustStrip.items);
    setPromoCards(nextSettings.home.promoGrid.cards);
    setBrands(nextSettings.home.brandsSection.items);
    setCertificates(nextSettings.home.certsSection.items);
    setStats(nextSettings.home.statsSection.items);
    setTopbarSocialLinks(nextSettings.topbar.socialLinks);
    setNavbarItems(nextSettings.navbar.navItems);
    setFooterSocialLinks(nextSettings.footer.socialLinks);
    setFooterColumns(nextSettings.footer.columns);
    setFooterContacts(nextSettings.footer.contactItems);
    setFooterPolicies(nextSettings.footer.policyLinks);
    setFooterPayments(nextSettings.footer.paymentMethods);
  };

  useEffect(() => {
    syncStorefrontState(settings);
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

  const clearMessages = () => {
    setError(null);
    setNotice(null);
  };

  const summaryMetrics = useMemo(() => {
    if (!dashboard?.metrics) {
      return [];
    }

    return [
      {
        label: 'Revenue',
        value: formatCurrency(dashboard.metrics.totalRevenue),
        helper: `${dashboard.metrics.orderCount} tracked orders are contributing to total revenue.`,
      },
      {
        label: 'Customers',
        value: String(dashboard.metrics.customerCount),
        helper: 'Profiles currently visible to the admin workspace.',
      },
      {
        label: 'Inbound',
        value: String(dashboard.metrics.quoteCount + dashboard.metrics.b2bLeadCount),
        helper: `${dashboard.metrics.quoteCount} quotes and ${dashboard.metrics.b2bLeadCount} business registrations require follow-up.`,
      },
      {
        label: 'Newsletter',
        value: String(dashboard.metrics.newsletterCount),
        helper: 'Contacts captured from storefront subscription surfaces.',
      },
    ];
  }, [dashboard]);

  const tabCounts = useMemo<Record<DashboardTab, string | undefined>>(
    () => ({
      overview: undefined,
      storefront: storefrontDraft.updatedAt,
      products: String(products.length),
      categories: String(categories.length),
      services: String(services.length),
      blog: String(posts.length),
      orders: dashboard ? String(dashboard.recentOrders.length) : undefined,
      quotes: dashboard ? String(dashboard.recentQuotes.length) : undefined,
      leads: dashboard ? String(dashboard.recentB2BRegistrations.length) : undefined,
      customers: dashboard ? String(dashboard.customers.length) : undefined,
    }),
    [categories.length, dashboard, posts.length, products.length, services.length, storefrontDraft.updatedAt],
  );

  const storefrontDirty = useMemo(
    () =>
      JSON.stringify(storefrontDraft) !== JSON.stringify(settings) ||
      JSON.stringify(heroSlides) !== JSON.stringify(settings.home.hero.slides) ||
      JSON.stringify(trustItems) !== JSON.stringify(settings.home.trustStrip.items) ||
      JSON.stringify(promoCards) !== JSON.stringify(settings.home.promoGrid.cards) ||
      JSON.stringify(brands) !== JSON.stringify(settings.home.brandsSection.items) ||
      JSON.stringify(certificates) !== JSON.stringify(settings.home.certsSection.items) ||
      JSON.stringify(stats) !== JSON.stringify(settings.home.statsSection.items) ||
      JSON.stringify(topbarSocialLinks) !== JSON.stringify(settings.topbar.socialLinks) ||
      JSON.stringify(navbarItems) !== JSON.stringify(settings.navbar.navItems) ||
      JSON.stringify(footerSocialLinks) !== JSON.stringify(settings.footer.socialLinks) ||
      JSON.stringify(footerColumns) !== JSON.stringify(settings.footer.columns) ||
      JSON.stringify(footerContacts) !== JSON.stringify(settings.footer.contactItems) ||
      JSON.stringify(footerPolicies) !== JSON.stringify(settings.footer.policyLinks) ||
      JSON.stringify(footerPayments) !== JSON.stringify(settings.footer.paymentMethods),
    [
      brands,
      certificates,
      footerColumns,
      footerContacts,
      footerPayments,
      footerPolicies,
      footerSocialLinks,
      heroSlides,
      navbarItems,
      promoCards,
      settings,
      stats,
      storefrontDraft,
      topbarSocialLinks,
      trustItems,
    ],
  );

  const copySections: Array<{ key: CopySectionKey; title: string; section: SiteSettings['home'][CopySectionKey] }> = [
    { key: 'categoriesSection', title: 'Categories', section: storefrontDraft.home.categoriesSection },
    { key: 'productsSection', title: 'Products', section: storefrontDraft.home.productsSection },
    { key: 'servicesSection', title: 'Services', section: storefrontDraft.home.servicesSection },
    { key: 'brandsSection', title: 'Brands', section: storefrontDraft.home.brandsSection },
    { key: 'dealsSection', title: 'Deals', section: storefrontDraft.home.dealsSection },
    { key: 'certsSection', title: 'Certificates', section: storefrontDraft.home.certsSection },
    { key: 'statsSection', title: 'Stats', section: storefrontDraft.home.statsSection },
    { key: 'blogSection', title: 'Blog', section: storefrontDraft.home.blogSection },
    { key: 'newsletterSection', title: 'Newsletter', section: storefrontDraft.home.newsletterSection },
    { key: 'appSection', title: 'App CTA', section: storefrontDraft.home.appSection },
  ];

  const handleSaveStorefront = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const nextSettings: SiteSettings = {
        ...storefrontDraft,
        topbar: { ...storefrontDraft.topbar, socialLinks: topbarSocialLinks },
        navbar: { ...storefrontDraft.navbar, navItems: navbarItems },
        home: {
          ...storefrontDraft.home,
          hero: { ...storefrontDraft.home.hero, slides: heroSlides },
          trustStrip: { ...storefrontDraft.home.trustStrip, items: trustItems },
          promoGrid: { ...storefrontDraft.home.promoGrid, cards: promoCards },
          brandsSection: { ...storefrontDraft.home.brandsSection, items: brands },
          certsSection: { ...storefrontDraft.home.certsSection, items: certificates },
          statsSection: { ...storefrontDraft.home.statsSection, items: stats },
        },
        footer: {
          ...storefrontDraft.footer,
          socialLinks: footerSocialLinks,
          columns: footerColumns,
          contactItems: footerContacts,
          policyLinks: footerPolicies,
          paymentMethods: footerPayments,
        },
      };

      const saved = await saveSettings(nextSettings);
      syncStorefrontState(saved);
      setNotice('Storefront settings saved.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to save storefront settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const catalogState = useMemo(
    () => ({
      product: {
        items: products,
        draft: productDraft as CatalogEntity,
        setDraft: (draft: CatalogEntity) => setProductDraft(draft as Product),
      },
      category: {
        items: categories,
        draft: categoryDraft as CatalogEntity,
        setDraft: (draft: CatalogEntity) => setCategoryDraft(draft as Category),
      },
      service: {
        items: services,
        draft: serviceDraft as CatalogEntity,
        setDraft: (draft: CatalogEntity) => setServiceDraft(draft as Service),
      },
      post: {
        items: posts,
        draft: postDraft as CatalogEntity,
        setDraft: (draft: CatalogEntity) => setPostDraft(draft as BlogPost),
      },
    }),
    [categories, categoryDraft, postDraft, posts, productDraft, products, serviceDraft, services],
  );

  const getCatalogConflict = (type: CatalogEntityType) => {
    const current = catalogState[type];
    const normalizedDraft = normalizeCatalogDraft(type, current.draft);
    const normalizedSlug = getNormalizedItemSlug(normalizedDraft);

    if (!normalizedSlug) {
      return null;
    }

    return current.items.find((item) => getNormalizedItemSlug(item) === normalizedSlug && item.id !== normalizedDraft.id) ?? null;
  };

  const openCatalogConflict = (type: CatalogEntityType) => {
    const conflict = getCatalogConflict(type);

    if (!conflict) {
      return;
    }

    catalogState[type].setDraft(conflict);
    setNotice(`Opened the existing record using slug "${getNormalizedItemSlug(conflict)}".`);
  };

  const saveCatalogEntity = async (type: CatalogEntityType) => {
    setIsSaving(true);
    setError(null);

    try {
      const current = catalogState[type];
      const normalizedDraft = normalizeCatalogDraft(type, current.draft);
      const conflict = getCatalogConflict(type);

      current.setDraft(normalizedDraft);

      if (conflict) {
        throw new Error(`Slug "${getNormalizedItemSlug(conflict)}" is already used by "${getEntityTitle(conflict)}". Open the existing item or change the slug.`);
      }

      if (type === 'product') {
        const draft = normalizedDraft as Product;
        const saved = draft.id && products.some((item) => item.id === draft.id)
          ? await api.products.admin.update(draft.id, draft)
          : await api.products.admin.create(draft);
        setProductDraft(saved);
        setNotice(`Product ${saved.title} saved.`);
      }

      if (type === 'category') {
        const draft = normalizedDraft as Category;
        const saved = draft.id && categories.some((item) => item.id === draft.id)
          ? await api.categories.admin.update(draft.id, draft)
          : await api.categories.admin.create(draft);
        setCategoryDraft(saved);
        setNotice(`Category ${saved.name} saved.`);
      }

      if (type === 'service') {
        const draft = normalizedDraft as Service;
        const saved = draft.id && services.some((item) => item.id === draft.id)
          ? await api.services.admin.update(draft.id, draft)
          : await api.services.admin.create(draft);
        setServiceDraft(saved);
        setNotice(`Service ${saved.title} saved.`);
      }

      if (type === 'post') {
        const draft = normalizedDraft as BlogPost;
        const saved = draft.id && posts.some((item) => item.id === draft.id)
          ? await api.blog.admin.update(draft.id, draft)
          : await api.blog.admin.create(draft);
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

  const deleteCatalogEntity = async (type: CatalogEntityType) => {
    setIsSaving(true);
    setError(null);

    try {
      const current = catalogState[type].draft;

      if (!current.id) {
        return;
      }

      if (type === 'product') {
        await api.products.admin.delete(current.id);
        setProductDraft(getDraftSeed('product', categories) as Product);
      }

      if (type === 'category') {
        await api.categories.admin.delete(current.id);
        setCategoryDraft(getDraftSeed('category', categories) as Category);
      }

      if (type === 'service') {
        await api.services.admin.delete(current.id);
        setServiceDraft(getDraftSeed('service', categories) as Service);
      }

      if (type === 'post') {
        await api.blog.admin.delete(current.id);
        setPostDraft(getDraftSeed('post', categories) as BlogPost);
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
    if (order.status === status) {
      return;
    }

    setUpdatingOrderId(order.id);
    setError(null);

    try {
      await api.orders.updateStatus(order.id, status);
      setNotice(`Order ${order.orderNumber} moved to ${ORDER_STATUS_LABELS[status]}.`);
      await loadWorkspace();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleQuoteStatusUpdate = async (quote: QuoteRequest, status: QuoteRequest['status']) => {
    if (quote.status === status) {
      return;
    }

    setUpdatingLeadId(quote.id);
    setError(null);

    try {
      await api.quote.update(quote.id, { status });
      setNotice(`Quote request from ${quote.company} moved to ${status}.`);
      await loadWorkspace();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to update quote status.');
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleB2BStatusUpdate = async (b2b: B2BRegistration, status: B2BRegistration['status']) => {
    if (b2b.status === status) {
      return;
    }

    setUpdatingLeadId(b2b.id);
    setError(null);

    try {
      await api.b2b.update(b2b.id, { status });
      setNotice(`B2B registration from ${b2b.companyName} moved to ${status}.`);
      await loadWorkspace();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to update B2B status.');
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const quickToggleCatalogEntity = async (type: CatalogEntityType, item: CatalogEntity) => {
    const nextVisibility = !getEntityIsVisible(item);
    setQuickToggleKey(`${type}:${item.id}`);
    setError(null);

    try {
      if (type === 'product') {
        await api.products.admin.update(item.id, { ...(item as Product), isActive: nextVisibility });
      }

      if (type === 'category') {
        await api.categories.admin.update(item.id, { ...(item as Category), isActive: nextVisibility });
      }

      if (type === 'service') {
        await api.services.admin.update(item.id, { ...(item as Service), isActive: nextVisibility });
      }

      if (type === 'post') {
        await api.blog.admin.update(item.id, { ...(item as BlogPost), isActive: nextVisibility });
      }

      setNotice(`${getEntityTitle(item)} is now ${nextVisibility ? 'visible' : 'hidden'}.`);
      await loadWorkspace();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to update visibility.');
    } finally {
      setQuickToggleKey(null);
    }
  };

  const runCatalogFilter = <T extends CatalogEntity>(items: T[]) =>
    items.filter((item) => {
      const visibleMatch =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && getEntityIsVisible(item)) ||
        (visibilityFilter === 'hidden' && !getEntityIsVisible(item));

      if (!visibleMatch) {
        return false;
      }

      if (!deferredEntitySearch) {
        return true;
      }

      const haystack = [getEntityTitle(item), item.slug, getEntityDescription(item)].join(' ').toLowerCase();
      return haystack.includes(deferredEntitySearch);
    });

  const filteredProducts = useMemo(() => runCatalogFilter(products), [deferredEntitySearch, products, visibilityFilter]);
  const filteredCategories = useMemo(() => runCatalogFilter(categories), [categories, deferredEntitySearch, visibilityFilter]);
  const filteredServices = useMemo(() => runCatalogFilter(services), [deferredEntitySearch, services, visibilityFilter]);
  const filteredPosts = useMemo(() => runCatalogFilter(posts), [deferredEntitySearch, posts, visibilityFilter]);

  return {
    activeTab,
    setActiveTab,
    dashboard,
    products,
    categories,
    services,
    posts,
    storefrontDraft,
    setStorefrontDraft,
    heroSlides,
    setHeroSlides,
    trustItems,
    setTrustItems,
    promoCards,
    setPromoCards,
    brands,
    setBrands,
    certificates,
    setCertificates,
    stats,
    setStats,
    topbarSocialLinks,
    setTopbarSocialLinks,
    navbarItems,
    setNavbarItems,
    footerSocialLinks,
    setFooterSocialLinks,
    footerColumns,
    setFooterColumns,
    footerContacts,
    setFooterContacts,
    footerPolicies,
    setFooterPolicies,
    footerPayments,
    setFooterPayments,
    productDraft,
    setProductDraft,
    categoryDraft,
    setCategoryDraft,
    serviceDraft,
    setServiceDraft,
    postDraft,
    setPostDraft,
    entitySearch,
    setEntitySearch,
    visibilityFilter,
    setVisibilityFilter,
    isLoading,
    isSaving,
    error,
    notice,
    updatingOrderId,
    updatingLeadId,
    quickToggleKey,
    summaryMetrics,
    tabCounts,
    storefrontDirty,
    copySections,
    filteredProducts,
    filteredCategories,
    filteredServices,
    filteredPosts,
    clearMessages,
    loadWorkspace,
    syncStorefrontState,
    handleSaveStorefront,
    saveCatalogEntity,
    deleteCatalogEntity,
    handleOrderStatusUpdate,
    handleQuoteStatusUpdate,
    handleB2BStatusUpdate,
    quickToggleCatalogEntity,
    getCatalogConflict,
    openCatalogConflict,
    getEntityTitle,
    getEntityDescription,
    getEntityIsVisible,
    getDraftSeed,
  };
}
