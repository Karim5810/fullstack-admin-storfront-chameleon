import { Panel, SectionCard, StatusPill, Field, ToggleField, textInputClass } from './AdminShell';
import type {
  CatalogEntityType,
  useAdminDashboardController,
} from '../../hooks/useAdminDashboardController';
import type { BlogPost, Category, Product, Service } from '../../types';
import {
  ProductDraftForm,
  CategoryDraftForm,
  ServiceDraftForm,
  BlogDraftForm,
} from './CatalogForms';

type CatalogTabProps = {
  activeTab: 'products' | 'categories' | 'services' | 'blog';
  controller: ReturnType<typeof useAdminDashboardController>;
  wrapSave: (type: CatalogEntityType, label: string) => () => Promise<void>;
  wrapDelete: (type: CatalogEntityType) => () => Promise<void>;
  addToast: (message: string, tone: 'success' | 'error', durationMs?: number) => void;
};

export function CatalogTab({
  activeTab,
  controller,
  wrapSave,
  wrapDelete,
}: CatalogTabProps) {
  const {
    filteredProducts,
    filteredCategories,
    filteredServices,
    filteredPosts,
    productDraft,
    setProductDraft,
    categoryDraft,
    setCategoryDraft,
    serviceDraft,
    setServiceDraft,
    postDraft,
    setPostDraft,
    categories,
    entitySearch,
    setEntitySearch,
    visibilityFilter,
    setVisibilityFilter,
    quickToggleCatalogEntity,
    getEntityTitle,
    getEntityIsVisible,
    getDraftSeed,
  } = controller;

  const config =
    activeTab === 'products'
      ? {
          type: 'product' as const,
          title: 'Products',
          items: filteredProducts as Product[],
          draft: productDraft as Product,
          setDraft: setProductDraft,
        }
      : activeTab === 'categories'
        ? {
            type: 'category' as const,
            title: 'Categories',
            items: filteredCategories as Category[],
            draft: categoryDraft as Category,
            setDraft: setCategoryDraft,
          }
        : activeTab === 'services'
          ? {
              type: 'service' as const,
              title: 'Services',
              items: filteredServices as Service[],
              draft: serviceDraft as Service,
              setDraft: setServiceDraft,
            }
          : {
              type: 'post' as const,
              title: 'Blog posts',
              items: filteredPosts as BlogPost[],
              draft: postDraft as BlogPost,
              setDraft: setPostDraft,
            };

  const handleCreateNew = () => {
    const seed = getDraftSeed(config.type, categories);
    config.setDraft(seed as any);
  };

  return (
    <div className="space-y-6">
      <Panel
        title={`${config.title} catalog`}
        eyebrow="Catalog"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={handleCreateNew}
            >
              New
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={() => void wrapSave(config.type, config.title.slice(0, -1))()}
            >
              Save
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              onClick={() => void wrapDelete(config.type)()}
            >
              Delete
            </button>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <SectionCard title="Items">
            <div className="space-y-4">
              <div className="grid gap-3">
                <Field label="Search">
                  <input
                    className={textInputClass()}
                    placeholder="Search by title, slug, or description…"
                    value={entitySearch}
                    onChange={(event) => setEntitySearch(event.target.value)}
                  />
                </Field>
                <Field label="Visibility">
                  <select
                    className={textInputClass()}
                    value={visibilityFilter}
                    onChange={(event) => setVisibilityFilter(event.target.value as any)}
                  >
                    <option value="all">All items</option>
                    <option value="visible">Visible only</option>
                    <option value="hidden">Hidden only</option>
                  </select>
                </Field>
              </div>

              <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
                {config.items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                    Nothing here yet. Create your first entry using the <strong>New</strong> button.
                  </div>
                ) : (
                  config.items.map((item) => {
                    const isVisible = getEntityIsVisible(item);
                    const isActive = item.id === config.draft.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? 'border-orange-300 bg-orange-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => config.setDraft(item as any)}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{getEntityTitle(item)}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {item.slug || 'No slug'}
                          </p>
                        </div>
                        <StatusPill
                          label={isVisible ? 'Visible' : 'Hidden'}
                          tone={isVisible ? 'success' : 'warning'}
                        />
                        <ToggleField
                          label=""
                          checked={isVisible}
                          onChange={() => void quickToggleCatalogEntity(config.type, item as any)}
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Editor">
            {config.type === 'product' && (
              <ProductDraftForm
                draft={config.draft as Product}
                categories={categories}
                onChange={config.setDraft as (draft: Product) => void}
              />
            )}
            {config.type === 'category' && (
              <CategoryDraftForm
                draft={config.draft as Category}
                onChange={config.setDraft as (draft: Category) => void}
              />
            )}
            {config.type === 'service' && (
              <ServiceDraftForm
                draft={config.draft as Service}
                categories={categories}
                onChange={config.setDraft as (draft: Service) => void}
              />
            )}
            {config.type === 'post' && (
              <BlogDraftForm
                draft={config.draft as BlogPost}
                onChange={config.setDraft as (draft: BlogPost) => void}
              />
            )}
          </SectionCard>
        </div>
      </Panel>
    </div>
  );
}

