import { Panel, SectionCard, EmptyState, StatusPill } from './AdminShell';
import type { useAdminDashboardController } from '../../hooks/useAdminDashboardController';
import type { Order, QuoteRequest, B2BRegistration, User } from '../../types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from '../../utils/orders';

type Controller = ReturnType<typeof useAdminDashboardController>;

type TabProps = {
  controller: Controller;
};

export function OrdersTab({ controller }: TabProps) {
  const orders = controller.dashboard?.recentOrders ?? [];

  return (
    <Panel title="Orders" eyebrow="Sales">
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Customer orders from the storefront will show up here."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-200 bg-white p-4 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    Order #{order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {order.items.length} items •{' '}
                    {order.total.toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'EGP',
                    })}
                  </p>
                </div>
                <StatusPill
                  label={ORDER_STATUS_LABELS[order.status]}
                  tone={order.status === 'cancelled' ? 'danger' : 'accent'}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {ORDER_STATUS_STEPS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      order.status === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => void controller.handleOrderStatusUpdate(order, status)}
                    disabled={controller.updatingOrderId === order.id}
                  >
                    {ORDER_STATUS_LABELS[status]}
                  </button>
                ))}
                {order.status === 'cancelled' ? null : (
                  <button
                    type="button"
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    onClick={() => void controller.handleOrderStatusUpdate(order, 'cancelled')}
                    disabled={controller.updatingOrderId === order.id}
                  >
                    {ORDER_STATUS_LABELS.cancelled}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function QuotesTab({ controller }: TabProps) {
  const quotes = controller.dashboard?.recentQuotes ?? [];

  return (
    <Panel title="Quotes" eyebrow="Sales">
      {quotes.length === 0 ? (
        <EmptyState
          title="No quote requests"
          description="Quote requests submitted from the storefront will appear here."
        />
      ) : (
        <div className="space-y-3">
          {quotes.map((quote: QuoteRequest) => (
            <div
              key={quote.id}
              className="rounded-3xl border border-slate-200 bg-white p-4 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {quote.company}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {quote.contactName} • {quote.phone}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    حجم الطلب: {quote.orderSize}
                  </p>
                </div>
                <StatusPill label={quote.status.toUpperCase()} tone="accent" />
              </div>

              <p className="mt-3 text-xs text-slate-600 line-clamp-3">
                {quote.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {['new', 'reviewing', 'quoted', 'closed'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      quote.status === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() =>
                      void controller.handleQuoteStatusUpdate(quote, status as QuoteRequest['status'])
                    }
                    disabled={controller.updatingLeadId === quote.id}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function LeadsTab({ controller }: TabProps) {
  const leads = controller.dashboard?.recentB2BRegistrations ?? [];

  return (
    <Panel title="B2B leads" eyebrow="Sales">
      {leads.length === 0 ? (
        <EmptyState
          title="No B2B leads"
          description="Corporate registration requests from the storefront will appear here."
        />
      ) : (
        <div className="space-y-3">
          {leads.map((lead: B2BRegistration) => (
            <div
              key={lead.id}
              className="rounded-3xl border border-slate-200 bg-white p-4 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {lead.companyName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {lead.contactName} • {lead.phone}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    القطاع: {lead.sector}
                  </p>
                </div>
                <StatusPill label={lead.status.toUpperCase()} tone="accent" />
              </div>

              <p className="mt-3 text-xs text-slate-600 line-clamp-3">
                {lead.requirements}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {['pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      lead.status === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() =>
                      void controller.handleB2BStatusUpdate(
                        lead,
                        status as B2BRegistration['status'],
                      )
                    }
                    disabled={controller.updatingLeadId === lead.id}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function CustomersTab({ controller }: TabProps) {
  const customers = controller.dashboard?.customers ?? [];

  return (
    <Panel title="Customers" eyebrow="CRM">
      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="When users create accounts or place orders, they will appear here."
        />
      ) : (
        <SectionCard title="Customer list">
          <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
            {customers.map((customer: User) => (
              <div
                key={customer.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {customer.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {customer.email}
                  </p>
                </div>
                <StatusPill label={customer.role.toUpperCase()} tone="accent" />
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </Panel>
  );
}

