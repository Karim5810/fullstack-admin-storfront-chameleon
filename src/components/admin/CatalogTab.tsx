import { useState } from 'react';
import type {
  CatalogEntityType,
  useAdminDashboardController,
} from '../../hooks/useAdminDashboardController';
import type { BlogPost, Category, Product, Service } from '../../types';
import { CatalogTable } from './CatalogTable';
import { CatalogEditor } from './CatalogEditor';
import { CatalogToolbar } from './CatalogToolbar';
import { CatalogEditModal } from './CatalogEditModal';
import { Pagination } from './Pagination';

type CatalogTabProps = {
  activeTab: 'products' | 'categories' | 'services' | 'blog';
  controller: ReturnType<typeof useAdminDashboardController>;
  wrapSave: (type: CatalogEntityType, label: string) => () => Promise<void>;
  wrapDelete: (type: CatalogEntityType) => () => Promise<void>;
  addToast: (message: string, tone: 'success' | 'error', durationMs?: number) => void;
};

type CatalogItem = Product | Category | Service | BlogPost;

const ITEMS_PER_PAGE = 25;

export function CatalogTab({
  activeTab,
  controller,
  wrapSave,
  wrapDelete,
  addToast,
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

  // Modal & pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const config =
    activeTab === 'products'
      ? {
          type: 'product' as const,
          title: 'المنتجات',
          items: filteredProducts as CatalogItem[],
          draft: productDraft as Product,
          setDraft: setProductDraft,
        }
      : activeTab === 'categories'
        ? {
            type: 'category' as const,
            title: 'الأقسام',
            items: filteredCategories as CatalogItem[],
            draft: categoryDraft as Category,
            setDraft: setCategoryDraft,
          }
        : activeTab === 'services'
          ? {
              type: 'service' as const,
              title: 'الخدمات',
              items: filteredServices as CatalogItem[],
              draft: serviceDraft as Service,
              setDraft: setServiceDraft,
            }
          : {
              type: 'post' as const,
              title: 'مقالات المدونة',
              items: filteredPosts as CatalogItem[],
              draft: postDraft as BlogPost,
              setDraft: setPostDraft,
            };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setEntitySearch(value);
    setCurrentPage(1);
  };

  const handleVisibilityFilterChange = (value: 'all' | 'visible' | 'hidden') => {
    setVisibilityFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setEntitySearch('');
    setVisibilityFilter('all');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(config.items.length / ITEMS_PER_PAGE);
  const paginatedItems = config.items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modal handlers
  const handleEditItem = (item: CatalogItem) => {
    config.setDraft(item as any);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    const seed = getDraftSeed(config.type, categories);
    config.setDraft(seed as any);
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    setIsSaving(true);
    try {
      await wrapSave(config.type, config.title.slice(0, -1))();
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (item: CatalogItem) => {
    if (isDeleteConfirming === item.id) {
      setIsDeleting(true);
      try {
        config.setDraft(item as any);
        await wrapDelete(config.type)();
        setIsDeleteConfirming(null);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setIsDeleteConfirming(item.id);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent, item: CatalogItem) => {
    e.stopPropagation();
    void quickToggleCatalogEntity(config.type, item as any);
  };

  const hasAppliedFilters =
    entitySearch !== '' || visibilityFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-white px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إدارة {config.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {config.items.length} عنصر{config.items.length !== 1 ? 'ا' : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              ✚ إنشاء جديد
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 md:px-6">
          <CatalogToolbar
            search={entitySearch}
            onSearchChange={handleSearchChange}
            visibilityFilter={visibilityFilter}
            onVisibilityFilterChange={handleVisibilityFilterChange}
            hasAppliedFilters={hasAppliedFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Table */}
        <CatalogTable
          items={paginatedItems}
          onEditItem={handleEditItem}
          onToggleVisibility={handleToggleVisibility}
          onDeleteItem={handleDeleteItem}
          getTitle={getEntityTitle}
          getSlug={(item) => item.slug || ''}
          getIsVisible={getEntityIsVisible}
          emptyMessage={
            config.items.length === 0 && !hasAppliedFilters
              ? 'لا توجد عناصر. اضغط "إنشاء جديد" للبدء.'
              : 'لا توجد نتائج تطابق بحثك.'
          }
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={config.items.length}
          />
        )}
      </div>

      {/* Edit Modal */}
      <CatalogEditModal
        isOpen={isModalOpen}
        title={
          config.draft.id
            ? `تعديل ${config.type === 'product' ? 'منتج' : config.type === 'category' ? 'قسم' : config.type === 'service' ? 'خدمة' : 'مقالة'}`
            : `إنشاء ${config.type === 'product' ? 'منتج' : config.type === 'category' ? 'قسم' : config.type === 'service' ? 'خدمة' : 'مقالة'} جديد`
        }
        subtitle={
          config.draft.id
            ? `${getEntityTitle(config.draft)}`
            : undefined
        }
        onClose={() => {
          setIsModalOpen(false);
          setIsDeleteConfirming(null);
        }}
        onSave={handleSaveModal}
        isSaving={isSaving}
      >
        {/* Delete button in modal */}
        {config.draft.id && (
          <div>
            {isDeleteConfirming === config.draft.id ? (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-900">
                  هل أنت متأكد من حذف هذا العنصر؟ هذا الإجراء لا يمكن التراجع عنه.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirming(null)}
                    disabled={isDeleting}
                    className="text-xs font-medium text-red-700 hover:text-red-900 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteItem(config.draft as any)}
                    disabled={isDeleting}
                    className={`px-2 py-1 text-xs font-medium text-white rounded transition-colors ${
                      isDeleting
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    aria-busy={isDeleting}
                  >
                    {isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsDeleteConfirming(config.draft.id)}
                className="mb-6 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                🗑️ حذف هذا العنصر
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <CatalogEditor
          type={config.type}
          draft={config.draft as any}
          categories={categories}
          onChange={config.setDraft as any}
        />
      </CatalogEditModal>
    </div>
  );
}
