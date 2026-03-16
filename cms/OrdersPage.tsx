import { useState } from "react";
import {
  Search,
  Eye,
  Package,
  Truck,
  RotateCcw,
  XCircle,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { useOrders } from "./hooks";
import {
  Button,
  Badge,
  Avatar,
  Spinner,
  Dropdown,
  Toggle,
  type Column,
} from "../components/ui/index";
import { DataTable } from "../components/ui/index";
import type { Order } from "./types";

const PAY_BADGE: Record<string, "success" | "warning" | "ghost" | "danger"> = {
  paid: "success",
  pending: "warning",
  authorized: "primary" as "success",
  refunded: "ghost",
  partially_refunded: "warning",
  voided: "danger",
};
const FULFILL_BADGE: Record<
  string,
  "ghost" | "warning" | "success" | "danger"
> = {
  unfulfilled: "ghost",
  partial: "warning",
  fulfilled: "success",
  restocked: "danger",
};

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [selected, setOrder] = useState<Order | null>(null);
  const [showRefund, setShowRefund] = useState(false);
  const [showFulfill, setShowFulfill] = useState(false);

  const { orders, total, loading, cancel, fulfill, refund, addNote } =
    useOrders({ search, status: (statusF as Order["status"]) || undefined });

  const columns: Column<Order>[] = [
    {
      key: "name",
      header: "Order",
      sortable: true,
      cell: (row: Order) => (
        <div>
          <div
            style={{ fontWeight: 700, color: "var(--primary)", fontSize: 14 }}
          >
            {row.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Customer",
      sortable: true,
      cell: (row: Order) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            name={
              row.customer
                ? `${row.customer.firstName} ${row.customer.lastName}`
                : (row.email ?? "?")
            }
            size="sm"
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {row.customer
                ? `${row.customer.firstName} ${row.customer.lastName}`
                : "Guest"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      sortable: true,
      cell: (row: Order) => (
        <Badge variant={PAY_BADGE[row.paymentStatus] ?? "ghost"}>
          {row.paymentStatus.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "fulfillmentStatus",
      header: "Fulfillment",
      sortable: true,
      cell: (row: Order) => (
        <Badge variant={FULFILL_BADGE[row.fulfillmentStatus] ?? "ghost"}>
          {row.fulfillmentStatus}
        </Badge>
      ),
    },
    {
      key: "totalPrice",
      header: "Total",
      sortable: true,
      align: "right",
      cell: (row: Order) => (
        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
          ${row.totalPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: "id",
      header: "",
      align: "right",
      cell: (row: Order) => (
        <Dropdown
          placement="bottom-right"
          trigger={
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              <MoreHorizontal size={16} />
            </button>
          }
          items={[
            {
              id: "view",
              label: "View Details",
              icon: <Eye size={14} />,
              onClick: () => setOrder(row),
            },
            {
              id: "fulfill",
              label: "Fulfill",
              icon: <Package size={14} />,
              onClick: () => {
                setOrder(row);
                setShowFulfill(true);
              },
              disabled: row.fulfillmentStatus === "fulfilled",
            },
            {
              id: "refund",
              label: "Refund",
              icon: <RotateCcw size={14} />,
              onClick: () => {
                setOrder(row);
                setShowRefund(true);
              },
              disabled: row.paymentStatus !== "paid",
            },
            { id: "div", label: "", divider: true, onClick: () => {} },
            {
              id: "cancel",
              label: "Cancel Order",
              icon: <XCircle size={14} />,
              danger: true,
              onClick: () => {
                if (confirm("Cancel this order?")) cancel(row.id);
              },
              disabled: row.status === "cancelled",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">{total} total orders</p>
          </div>
          <Button variant="ghost" size="sm" iconLeft={<Download size={15} />}>
            Export
          </Button>
        </div>
      </div>

      {/* Status filter */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer, or email…"
            style={{
              width: "100%",
              padding: "9px 14px 9px 38px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />
        </div>
        {["All", "Open", "Closed", "Cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusF(s === "All" ? "" : s.toLowerCase())}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${(statusF || "all") === (s === "All" ? "all" : s.toLowerCase()) ? "var(--primary)" : "var(--border)"}`,
              background:
                (statusF || "all") === (s === "All" ? "all" : s.toLowerCase())
                  ? "rgba(59,130,246,.1)"
                  : "var(--card-bg)",
              color:
                (statusF || "all") === (s === "All" ? "all" : s.toLowerCase())
                  ? "var(--primary)"
                  : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 0",
          }}
        >
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          searchable={false}
          pageSize={10}
        />
      )}

      {/* Order Detail Drawer */}
      {selected && !showRefund && !showFulfill && (
        <OrderDetail
          order={selected}
          onClose={() => setOrder(null)}
          onFulfill={() => setShowFulfill(true)}
          onRefund={() => setShowRefund(true)}
          onCancel={() => {
            cancel(selected.id);
            setOrder(null);
          }}
          onNote={(n) => addNote(selected.id, n)}
        />
      )}

      {showFulfill && selected && (
        <FulfillModal
          order={selected}
          onClose={() => {
            setShowFulfill(false);
            setOrder(null);
          }}
          onFulfill={(data) => {
            fulfill(selected.id, data);
            setShowFulfill(false);
            setOrder(null);
          }}
        />
      )}

      {showRefund && selected && (
        <RefundModal
          order={selected}
          onClose={() => {
            setShowRefund(false);
            setOrder(null);
          }}
          onRefund={(data) => {
            refund(selected.id, data);
            setShowRefund(false);
            setOrder(null);
          }}
        />
      )}
    </div>
  );
}

function OrderDetail({
  order,
  onClose,
  onFulfill,
  onRefund,
  onCancel,
  onNote,
}: {
  order: Order;
  onClose: () => void;
  onFulfill: () => void;
  onRefund: () => void;
  onCancel: () => void;
  onNote: (n: string) => void;
}) {
  const [note, setNote] = useState(order.note ?? "");
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Order {order.name}</h3>
            <p className="modal-subtitle">
              {new Date(order.createdAt).toLocaleString()} · {order.currency}{" "}
              {order.totalPrice.toFixed(2)}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {order.paymentStatus === "paid" &&
              order.fulfillmentStatus !== "fulfilled" && (
                <Button
                  size="sm"
                  iconLeft={<Truck size={14} />}
                  onClick={onFulfill}
                >
                  Fulfill
                </Button>
              )}
            {order.paymentStatus === "paid" && (
              <Button
                size="sm"
                variant="outline"
                iconLeft={<RotateCcw size={14} />}
                onClick={onRefund}
              >
                Refund
              </Button>
            )}
            {order.status !== "cancelled" && (
              <Button size="sm" variant="danger" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div
          className="modal-body"
          style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Line items */}
            <div
              style={{
                background: "var(--bg-tertiary)",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              {order.lineItems.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: "var(--card-bg)",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <Package size={20} color="var(--text-muted)" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.title}
                    </div>
                    {item.variantTitle && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {item.variantTitle}
                      </div>
                    )}
                    {item.sku && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        SKU: {item.sku}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      ×{item.quantity}
                    </div>
                    <div
                      style={{ fontWeight: 700, color: "var(--text-primary)" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              <div
                style={{
                  padding: "16px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  { label: "Subtotal", value: order.subtotalPrice },
                  { label: "Shipping", value: order.totalShipping },
                  { label: "Tax", value: order.totalTax },
                  { label: "Discount", value: -order.totalDiscounts },
                ]
                  .filter((r) => r.value !== 0)
                  .map((r) => (
                    <div
                      key={r.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span>{r.label}</span>
                      <span>
                        {r.value < 0 ? "-" : ""}${Math.abs(r.value).toFixed(2)}
                      </span>
                    </div>
                  ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    fontSize: 15,
                    color: "var(--text-primary)",
                    paddingTop: 8,
                    borderTop: "1px solid var(--border)",
                    marginTop: 4,
                  }}
                >
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                padding: 16,
                border: "1px solid var(--border)",
              }}
            >
              <h6 style={{ marginBottom: 10, color: "var(--text-primary)" }}>
                Internal Note
              </h6>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add a note about this order…"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <Button
                size="xs"
                style={{ marginTop: 8 }}
                onClick={() => onNote(note)}
              >
                Save Note
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InfoCard title="Customer">
              {order.customer ? (
                <>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontSize: 14,
                    }}
                  >
                    {order.customer.firstName} {order.customer.lastName}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {order.customer.email}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {order.email ?? "Guest"}
                </div>
              )}
            </InfoCard>
            {order.shippingAddress && (
              <InfoCard title="Shipping Address">
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.address1}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                  {order.shippingAddress.zip}
                  <br />
                  {order.shippingAddress.country}
                </div>
              </InfoCard>
            )}
            <InfoCard title="Status">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Payment
                  </span>
                  <Badge variant={PAY_BADGE[order.paymentStatus] ?? "ghost"}>
                    {order.paymentStatus.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Fulfillment
                  </span>
                  <Badge
                    variant={FULFILL_BADGE[order.fulfillmentStatus] ?? "ghost"}
                  >
                    {order.fulfillmentStatus}
                  </Badge>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Order
                  </span>
                  <Badge variant="ghost">{order.status}</Badge>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 12,
        padding: 16,
        border: "1px solid var(--border)",
      }}
    >
      <h6
        style={{
          marginBottom: 10,
          color: "var(--text-muted)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 700,
        }}
      >
        {title}
      </h6>
      {children}
    </div>
  );
}

function FulfillModal({
  order,
  onClose,
  onFulfill,
}: {
  order: Order;
  onClose: () => void;
  onFulfill: (d: {
    lineItems: { lineItemId: string; quantity: number }[];
    trackingNumber?: string;
    carrier?: string;
    notifyCustomer?: boolean;
  }) => void;
}) {
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("UPS");
  const [notify, setNotify] = useState(true);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal-sm">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Fulfill Order {order.name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            ✕
          </button>
        </div>
        <div
          className="modal-body"
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Carrier
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {["UPS", "FedEx", "USPS", "DHL", "Other"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Tracking Number
            </label>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            />
          </div>
          <Toggle
            label="Notify customer by email"
            checked={notify}
            onChange={setNotify}
          />
        </div>
        <div className="modal-footer">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            iconLeft={<Truck size={14} />}
            onClick={() =>
              onFulfill({
                lineItems: order.lineItems.map((li: any) => ({
                  lineItemId: li.id,
                  quantity: li.quantity,
                })),
                trackingNumber: tracking,
                carrier,
                notifyCustomer: notify,
              })
            }
          >
            Mark as Fulfilled
          </Button>
        </div>
      </div>
    </div>
  );
}

function RefundModal({
  order,
  onClose,
  onRefund,
}: {
  order: Order;
  onClose: () => void;
  onRefund: (d: { amount: number; note?: string; restock?: boolean }) => void;
}) {
  const [amount, setAmount] = useState(order.totalPrice.toFixed(2));
  const [note, setNote] = useState("");
  const [restock, setRestock] = useState(true);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal-sm">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Refund {order.name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            ✕
          </button>
        </div>
        <div
          className="modal-body"
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Refund Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={order.totalPrice}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            />
            <p
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}
            >
              Maximum refundable: ${order.totalPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Reason
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for refund…"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            />
          </div>
          <Toggle
            label="Restock items"
            description="Return inventory to stock"
            checked={restock}
            onChange={setRestock}
          />
        </div>
        <div className="modal-footer">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            iconLeft={<RotateCcw size={14} />}
            onClick={() =>
              onRefund({ amount: parseFloat(amount), note, restock })
            }
          >
            Process Refund
          </Button>
        </div>
      </div>
    </div>
  );
}
