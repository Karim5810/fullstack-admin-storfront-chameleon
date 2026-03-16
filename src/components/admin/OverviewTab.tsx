import { ShoppingCart, FileSignature, Users, DollarSign } from 'lucide-react';
import { PageCard, StatCard, DataTable, TableHead, TableBody, TableRow, Th, Td, EmptyState, StatusPill } from './AdminShell';
import type { useAdminDashboardController } from '../../hooks/useAdminDashboardController';
import type { Order, QuoteRequest, B2BRegistration } from '../../types';
import { ORDER_STATUS_LABELS } from '../../utils/orders';

type OverviewTabProps = {
  controller: ReturnType<typeof useAdminDashboardController>;
  addToast: (message: string, tone: 'success' | 'error', durationMs?: number) => void;
};

const STAT_ICONS = [ShoppingCart, DollarSign, FileSignature, Users];

export function OverviewTab({ controller }: OverviewTabProps) {
  const { dashboard, summaryMetrics } = controller;
  const recentOrders = dashboard?.recentOrders ?? [];
  const recentQuotes = dashboard?.recentQuotes ?? [];
  const recentLeads = dashboard?.recentB2BRegistrations ?? [];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryMetrics.map((metric, i) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            change={metric.helper}
            icon={STAT_ICONS[i]}
          />
        ))}
      </div>

      {/* Two-column layout: Orders table + Inbound table */}
      <div className="grid gap-6 xl:grid-cols-2">
        <PageCard title="الطلبات الأخيرة" subtitle="آخر طلبات العملاء">
          {recentOrders.length === 0 ? (
            <EmptyState title="لا توجد طلبات حتى الآن" description="عندما يضع العملاء طلبات، ستظهر هنا." />
          ) : (
            <DataTable>
              <TableHead>
                <tr>
                  <Th>الطلب</Th>
                  <Th>التاريخ</Th>
                  <Th>الإجمالي</Th>
                  <Th>الحالة</Th>
                </tr>
              </TableHead>
              <TableBody>
                {recentOrders.map((order: Order) => (
                  <TableRow key={order.id}>
                    <Td>
                      <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                    </Td>
                    <Td className="text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</Td>
                    <Td className="font-medium">
                      {order.total.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                    </Td>
                    <Td>
                      <StatusPill
                        label={ORDER_STATUS_LABELS[order.status]}
                        tone={order.status === 'cancelled' ? 'danger' : 'accent'}
                      />
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          )}
        </PageCard>

        <PageCard title="النشاط الوارد" subtitle="طلبات عروض الأسعار وتسجيلات B2B">
          {recentQuotes.length === 0 && recentLeads.length === 0 ? (
            <EmptyState
              title="لا توجد طلبات واردة"
              description="ستظهر طلبات عروض الأسعار وتسجيلات B2B هنا."
            />
          ) : (
            <DataTable>
              <TableHead>
                <tr>
                  <Th>الشركة</Th>
                  <Th>جهة الاتصال</Th>
                  <Th>النوع</Th>
                  <Th>الحالة</Th>
                </tr>
              </TableHead>
              <TableBody>
                {recentQuotes.map((quote: QuoteRequest) => (
                  <TableRow key={`q-${quote.id}`}>
                    <Td className="font-medium">{quote.company}</Td>
                    <Td className="text-gray-500">{quote.contactName}</Td>
                    <Td className="text-gray-500">عرض سعر</Td>
                    <Td>
                      <StatusPill label={quote.status} tone="accent" />
                    </Td>
                  </TableRow>
                ))}
                {recentLeads.map((lead: B2BRegistration) => (
                  <TableRow key={`l-${lead.id}`}>
                    <Td className="font-medium">{lead.companyName}</Td>
                    <Td className="text-gray-500">{lead.contactName}</Td>
                    <Td className="text-gray-500">B2B</Td>
                    <Td>
                      <StatusPill label={lead.status} tone="accent" />
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          )}
        </PageCard>
      </div>
    </div>
  );
}
