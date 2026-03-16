import { PageCard, DataTable, TableHead, TableBody, TableRow, Th, Td, EmptyState, StatusPill } from './AdminShell';
import type { useAdminDashboardController } from '../../hooks/useAdminDashboardController';
import type { Order, QuoteRequest, B2BRegistration, User } from '../../types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from '../../utils/orders';

type Controller = ReturnType<typeof useAdminDashboardController>;
type TabProps = { controller: Controller };

export function OrdersTab({ controller }: TabProps) {
  const orders = controller.dashboard?.recentOrders ?? [];

  return (
    <PageCard
      title="الطلبات"
      subtitle="ادرة طلبات العملاء وتحديث الحالة"
      actions={
        <span className="text-sm text-gray-500">{orders.length} طلب{orders.length !== 1 ? 'ات' : ''}</span>
      }
    >
      {orders.length === 0 ? (
        <EmptyState
          title="لا توجد طلبات حتى الآن"
          description="ستظهر طلبات العملاء من متجر الإلكتروني هنا."
        />
      ) : (
        <DataTable>
          <TableHead>
            <tr>
              <Th>رقم الطلب</Th>
              <Th>التاريخ</Th>
              <Th>العناصر</Th>
              <Th>الإجمالي</Th>
              <Th>الحالة</Th>
              <Th className="text-right">الإجراءات</Th>
            </tr>
          </TableHead>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow key={order.id}>
                <Td className="font-medium">#{order.orderNumber}</Td>
                <Td className="text-gray-500">{new Date(order.createdAt).toLocaleString('ar-EG')}</Td>
                <Td className="text-gray-500">{order.items.length} عناصر</Td>
                <Td className="font-medium">
                  {order.total.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                </Td>
                <Td>
                  <StatusPill
                    label={ORDER_STATUS_LABELS[order.status]}
                    tone={order.status === 'cancelled' ? 'danger' : 'accent'}
                  />
                </Td>
                <Td className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {ORDER_STATUS_STEPS.filter((s) => s !== order.status).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          void controller.handleOrderStatusUpdate(order, status);
                        }}
                        disabled={controller.updatingOrderId === order.id}
                      >
                        {ORDER_STATUS_LABELS[status]}
                      </button>
                    ))}
                    {order.status !== 'cancelled' && (
                      <button
                        type="button"
                        className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          void controller.handleOrderStatusUpdate(order, 'cancelled');
                        }}
                        disabled={controller.updatingOrderId === order.id}
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}
    </PageCard>
  );
}

export function QuotesTab({ controller }: TabProps) {
  const quotes = controller.dashboard?.recentQuotes ?? [];

  return (
    <PageCard
      title="طلبات عروض الأسعار"
      subtitle="راجع وتحديث حالة طلب عرض السعر"
      actions={<span className="text-sm text-gray-500">{quotes.length} طلب{quotes.length !== 1 ? 'ات' : ''}</span>}
    >
      {quotes.length === 0 ? (
        <EmptyState
          title="لا توجد طلبات عروض أسعار"
          description="ستظهر طلبات عروض الأسعار موقع المتجر هنا."
        />
      ) : (
        <DataTable>
          <TableHead>
            <tr>
              <Th>الشركة</Th>
              <Th>جهة الاتصال</Th>
              <Th>حجم الطلب</Th>
              <Th>الحالة</Th>
              <Th className="text-right">الإجراءات</Th>
            </tr>
          </TableHead>
          <TableBody>
            {quotes.map((quote: QuoteRequest) => (
              <TableRow key={quote.id}>
                <Td className="font-medium">{quote.company}</Td>
                <Td>
                  <div>
                    <div className="font-medium text-gray-900">{quote.contactName}</div>
                    <div className="text-xs text-gray-500">{quote.phone}</div>
                  </div>
                </Td>
                <Td className="text-gray-500">{quote.orderSize}</Td>
                <Td>
                  <StatusPill label={quote.status} tone="accent" />
                </Td>
                <Td className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {(['new', 'reviewing', 'quoted', 'closed'] as const)
                      .filter((s) => s !== quote.status)
                      .map((status) => (
                        <button
                          key={status}
                          type="button"
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            void controller.handleQuoteStatusUpdate(quote, status);
                          }}
                          disabled={controller.updatingLeadId === quote.id}
                        >
                          {status}
                        </button>
                      ))}
                  </div>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}
    </PageCard>
  );
}

export function LeadsTab({ controller }: TabProps) {
  const leads = controller.dashboard?.recentB2BRegistrations ?? [];

  return (
    <PageCard
      title="فرص B2B"
      subtitle="طلبات التسجيل للمؤسسات"
      actions={<span className="text-sm text-gray-500">{leads.length} فرصه{leads.length !== 1 ? '' : ''}</span>}
    >
      {leads.length === 0 ? (
        <EmptyState
          title="لا توجد فرص B2B"
          description="ستظهر طلبات الأعمال من متجر الإلكتروني هنا."
        />
      ) : (
        <DataTable>
          <TableHead>
            <tr>
              <Th>الشركة</Th>
              <Th>جهة الاتصال</Th>
              <Th>القطاع</Th>
              <Th>الحالة</Th>
              <Th className="text-right">الإجراءات</Th>
            </tr>
          </TableHead>
          <TableBody>
            {leads.map((lead: B2BRegistration) => (
              <TableRow key={lead.id}>
                <Td className="font-medium">{lead.companyName}</Td>
                <Td>
                  <div>
                    <div className="font-medium text-gray-900">{lead.contactName}</div>
                    <div className="text-xs text-gray-500">{lead.phone}</div>
                  </div>
                </Td>
                <Td className="text-gray-500">{lead.sector}</Td>
                <Td>
                  <StatusPill label={lead.status} tone="accent" />
                </Td>
                <Td className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {(['pending', 'approved', 'rejected'] as const)
                      .filter((s) => s !== lead.status)
                      .map((status) => (
                        <button
                          key={status}
                          type="button"
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            void controller.handleB2BStatusUpdate(lead, status);
                          }}
                          disabled={controller.updatingLeadId === lead.id}
                        >
                          {status}
                        </button>
                      ))}
                  </div>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}
    </PageCard>
  );
}

export function CustomersTab({ controller }: TabProps) {
  const customers = controller.dashboard?.customers ?? [];

  return (
    <PageCard
      title="العملاء"
      subtitle="المستخدمون المسجلون وحسابات العملاء"
      actions={<span className="text-sm text-gray-500">{customers.length} عميل{customers.length !== 1 ? '' : ''}</span>}
    >
      {customers.length === 0 ? (
        <EmptyState
          title="لا يوجد عملاء حتى الآن"
          description="عندما ينشئ المستخدمون حسابات أو يضعون طلباتاً، سيظهرون هنا."
        />
      ) : (
        <DataTable>
          <TableHead>
            <tr>
              <Th>الاسم</Th>
              <Th>البريد الإلكتروني</Th>
              <Th>الدور</Th>
            </tr>
          </TableHead>
          <TableBody>
            {customers.map((customer: User) => (
              <TableRow key={customer.id}>
                <Td className="font-medium">{customer.name}</Td>
                <Td className="text-gray-500">{customer.email}</Td>
                <Td>
                  <StatusPill label={customer.role} tone="accent" />
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}
    </PageCard>
  );
}
