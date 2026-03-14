import { Panel, MetricCard, SectionCard, EmptyState, StatusPill } from './AdminShell';
import type { useAdminDashboardController } from '../../hooks/useAdminDashboardController';
import type { Order, QuoteRequest, B2BRegistration } from '../../types';
import { ORDER_STATUS_LABELS } from '../../utils/orders';

type OverviewTabProps = {
  controller: ReturnType<typeof useAdminDashboardController>;
  addToast: (message: string, tone: 'success' | 'error', durationMs?: number) => void;
};

export function OverviewTab({ controller }: OverviewTabProps) {
  const { dashboard, summaryMetrics } = controller;

  const recentOrders = dashboard?.recentOrders ?? [];
  const recentQuotes = dashboard?.recentQuotes ?? [];
  const recentLeads = dashboard?.recentB2BRegistrations ?? [];

  return (
    <div className="space-y-6">
      <Panel title="Overview" eyebrow="Workspace">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} helper={metric.helper} />
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Recent orders">
          {recentOrders.length === 0 ? (
            <EmptyState title="No orders yet" description="When customers place orders, they will appear here." />
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: Order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      Order #{order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.total.toLocaleString(undefined, { style: 'currency', currency: 'EGP' })}
                    </p>
                    <StatusPill label={ORDER_STATUS_LABELS[order.status]} tone={order.status === 'cancelled' ? 'danger' : 'accent'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Inbound activity">
          {recentQuotes.length === 0 && recentLeads.length === 0 ? (
            <EmptyState
              title="No inbound requests"
              description="Quote requests and B2B registrations from the storefront will appear here."
            />
          ) : (
            <div className="space-y-4">
              {recentQuotes.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Quotes
                  </p>
                  <div className="space-y-2">
                    {recentQuotes.map((quote: QuoteRequest) => (
                      <div
                        key={quote.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {quote.company}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {quote.contactName} • {quote.phone}
                            </p>
                          </div>
                          <StatusPill label={quote.status.toUpperCase()} tone="accent" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {recentLeads.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    B2B leads
                  </p>
                  <div className="space-y-2">
                    {recentLeads.map((lead: B2BRegistration) => (
                      <div
                        key={lead.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {lead.companyName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {lead.contactName} • {lead.phone}
                            </p>
                          </div>
                          <StatusPill label={lead.status.toUpperCase()} tone="accent" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

