/**
 * AdminDashboard.tsx
 *
 * ROLE: Orchestrator only.
 *
 * This file owns:
 *  - Top-level layout (header, sidebar, main)
 *  - Tab routing (which tab panel to render)
 *  - Cross-cutting side-effects (toast wrappers, delete dialog, sign-out)
 *
 * This file does NOT own:
 *  - Any render logic for individual tabs  → moved to /admin/tabs/
 *  - Primitive UI atoms (StatusPill, MetricCard, …) → already in AdminShell
 *  - Data-shaping helpers (getEntitySummary, etc.) → moved to /admin/catalogUtils
 *  - Nav config → moved to /admin/navConfig
 *
 * Target size: ~120 lines.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminMessage } from '../components/admin/AdminShell';
import { DeleteConfirmDialog } from '../components/admin/DeleteConfirmDialog';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { OverviewTab } from '../components/admin/OverviewTab';
import { StorefrontTab } from '../components/admin/StorefrontTab';
import { CatalogTab } from '../components/admin/CatalogTab';
import { OrdersTab, QuotesTab, LeadsTab, CustomersTab } from '../components/admin/SalesTabs';

import { useAuth } from '../contexts/AuthContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { useToast } from '../contexts/ToastContext';
import {
  type CatalogEntity,
  type CatalogEntityType,
  useAdminDashboardController,
} from '../hooks/useAdminDashboardController';


type DeleteDialogState = {
  open: boolean;
  type?: CatalogEntityType;
  item?: CatalogEntity;
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-440 animate-pulse rounded-4xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="h-10 w-72 rounded-2xl bg-slate-100" />
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings, saveSettings, isLoading: isSettingsLoading } = useSiteContent();
  const { addToast } = useToast();
  const controller = useAdminDashboardController({ settings, saveSettings });

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false });

  // Save and Delete wrappers
  const wrapSave = (type: CatalogEntityType, label: string) => async () => {
    try {
      await controller.saveCatalogEntity(type);
      addToast(`تم حفظ ${label}`, 'success', 4000);
    } catch (err) {
      addToast(`فشل حفظ ${label}`, 'error');
    }
  };

  const wrapDelete = (type: CatalogEntityType) => async () => {
    let item: CatalogEntity | undefined;
    switch (type) {
      case 'product':
        item = controller.productDraft;
        break;
      case 'category':
        item = controller.categoryDraft;
        break;
      case 'service':
        item = controller.serviceDraft;
        break;
      case 'post':
        item = controller.postDraft;
        break;
      default:
        item = undefined;
    }
    setDeleteDialog({ open: true, type, item });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.type) return;
    try {
      await controller.deleteCatalogEntity(deleteDialog.type);
      const label = deleteDialog.type.charAt(0).toUpperCase() + deleteDialog.type.slice(1);
      addToast(`تم حذف ${label}`, 'success', 4000);
      setDeleteDialog({ open: false });
    } catch {
      addToast('فشل الحذف', 'error');
    }
  };

  const wrapPublish = async () => {
    try {
      await controller.handleSaveStorefront();
      addToast('تم نشر المتجر', 'success', 4000);
    } catch {
      addToast('فشل نشر المتجر', 'error');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  // Loading state
  if (controller.isLoading || isSettingsLoading) return <LoadingSkeleton />;

  const activeTab = controller.activeTab;

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 text-left md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-440 space-y-6">

        {/* Header card */}
        <AdminHeader
          user={user}
          storefrontDirty={controller.storefrontDirty}
          onRefresh={() => void controller.loadWorkspace()}
          onSignOut={handleSignOut}
          onStorefront={() => controller.setActiveTab('storefront')} 
          activeTab={activeTab} 
          onMenuClick={() => {}}
        >
          {!!controller.error && <AdminMessage tone="error">{controller.error}</AdminMessage>}
          {!!controller.notice && <AdminMessage tone="success">{controller.notice}</AdminMessage>}
        </AdminHeader>

        {/* Sidebar + main body */}
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
          <AdminSidebar
            user={user}
            activeTab={activeTab}
            tabCounts={controller.tabCounts}
            onTabChange={(tab) => {
              controller.clearMessages();
              controller.setActiveTab(tab);
            }}
          />

          <main className="space-y-6">
            {activeTab === 'overview' && (
              <OverviewTab controller={controller} addToast={addToast} />
            )}

            {activeTab === 'storefront' && (
              <StorefrontTab controller={controller} onPublish={wrapPublish} />
            )}

            {(activeTab === 'products' ||
              activeTab === 'categories' ||
              activeTab === 'services' ||
              activeTab === 'blog') && (
              <CatalogTab
                activeTab={activeTab}
                controller={controller}
                wrapSave={wrapSave}
                wrapDelete={wrapDelete}
                addToast={addToast}
              />
            )}

            {activeTab === 'orders' && <OrdersTab controller={controller} />}
            {activeTab === 'quotes' && <QuotesTab controller={controller} />}
            {activeTab === 'leads' && <LeadsTab controller={controller} />}
            {activeTab === 'customers' && <CustomersTab controller={controller} />}
          </main>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        title="هل تريد الحذف نهائياً؟"
        message="لا يمكن التراجع عن هذا النشاط. سيتم إزالة جميع البيانات المرتبطة."
        itemName={deleteDialog.item ? controller.getEntityTitle(deleteDialog.item) : ''}
        isLoading={controller.isSaving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ open: false })}
      />
    </div>
  );
}
