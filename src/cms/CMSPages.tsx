// ═══════════════════════════════════════════════════════
//  NexusUI CMS — Remaining Pages
//  Customers · Promotions · Media · Navigation · SEO · Theme · Settings
// ═══════════════════════════════════════════════════════

import { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Search,
  Download,
  Edit,
  Eye,
  Settings as SettingsIcon,
  Truck,
  CreditCard,
  Bell,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Link,
  Copy,
  ExternalLink,
  GripVertical,
  ChevronRight,
  Package,
} from "lucide-react";
import {
  useCustomers,
  useDiscounts,
  useFlashSales,
  useMedia,
  useNavigation,
  useGlobalSEO,
  useThemes,
  useSettings,
} from "./hooks";
import {
  Button,
  Badge,
  Avatar,
  Spinner,
  Input,
  Toggle,
  DataTable,
  type Column,
} from "./components/ui";
import type {
  Customer,
  DiscountCode,
  MediaFile,
  NavMenu,
  NavLink as NavLinkType,
  StorefrontTheme,
} from "./types";

// ══════════════════════════════════════════════════════
//  CUSTOMERS PAGE
// ══════════════════════════════════════════════════════
export function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const { customers, total, loading, remove } = useCustomers({ search });

  const columns: Column<Customer>[] = [
    {
      key: "firstName",
      header: "Customer",
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            name={`${row.firstName} ${row.lastName}`}
            size="sm"
            status={row.state === "enabled" ? "online" : "offline"}
          />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {row.firstName} {row.lastName}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "state",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.state === "enabled" ? "success" : "ghost"}>
          {row.state}
        </Badge>
      ),
    },
    {
      key: "ordersCount",
      header: "Orders",
      sortable: true,
      align: "center",
      cell: (row) => (
        <strong style={{ color: "var(--text-primary)" }}>
          {row.ordersCount}
        </strong>
      ),
    },
    {
      key: "totalSpent",
      header: "Spent",
      sortable: true,
      align: "right",
      cell: (row) => (
        <strong style={{ color: "var(--text-primary)" }}>
          ${row.totalSpent.toFixed(2)}
        </strong>
      ),
    },
    {
      key: "acceptsMarketing",
      header: "Marketing",
      align: "center",
      cell: (row) =>
        row.acceptsMarketing ? (
          <CheckCircle2 size={16} color="var(--success)" />
        ) : (
          <XCircle size={16} color="var(--text-muted)" />
        ),
    },
    {
      key: "createdAt",
      header: "Joined",
      cell: (row) => (
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "id",
      header: "",
      align: "right",
      cell: (row) => (
        <Button
          size="xs"
          variant="ghost"
          iconLeft={<Eye size={12} />}
          onClick={() => setSelected(row)}
        >
          View
        </Button>
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
            <h1 className="page-title">Customers</h1>
            <p className="page-subtitle">{total} customers</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" size="sm" iconLeft={<Download size={14} />}>
              Export
            </Button>
            <Button size="sm" iconLeft={<Plus size={14} />}>
              Add Customer
            </Button>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: 20 }}>
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
          placeholder="Search by name or email…"
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
      {loading ? (
        <CenterSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          searchable={false}
          pageSize={10}
        />
      )}

      {selected && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal modal-md">
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar
                  name={`${selected.firstName} ${selected.lastName}`}
                  size="lg"
                />
                <div>
                  <h3 className="modal-title">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="modal-subtitle">
                    {selected.email} · {selected.ordersCount} orders · $
                    {selected.totalSpent.toFixed(2)} spent
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
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
            <div className="modal-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <InfoTile
                  label="Orders"
                  value={selected.ordersCount.toString()}
                />
                <InfoTile
                  label="Spent"
                  value={`$${selected.totalSpent.toFixed(2)}`}
                />
                <InfoTile label="State" value={selected.state} />
                <InfoTile
                  label="Marketing"
                  value={selected.acceptsMarketing ? "Yes" : "No"}
                />
              </div>
              {selected.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="ghost">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              {selected.note && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--bg-tertiary)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  {selected.note}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm("Delete customer?")) {
                    remove(selected.id);
                    setSelected(null);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--bg-tertiary)",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: ".5px",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}
      >
        {value}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  PROMOTIONS PAGE
// ══════════════════════════════════════════════════════
export function PromotionsPage() {
  const [tab, setTab] = useState<"codes" | "flash">("codes");
  const { discounts, loading, create, update, remove } =
    useDiscounts() as ReturnType<typeof useDiscounts> & {
      update: (id: string, d: Partial<DiscountCode>) => Promise<void>;
    };
  const {
    sales: flashSales,
    remove: removeFlash,
  } = useFlashSales();
  const [showNew, setShowNew] = useState(false);
  const [newCode, setNewCode] = useState({
    code: "",
    type: "percentage" as DiscountCode["type"],
    value: 10,
    minimumAmount: 0,
    usageLimit: 0,
    active: true,
    oncePerCustomer: false,
    appliesTo: "all" as DiscountCode["appliesTo"],
    combinesWith: { discountCodes: false, shippingDiscounts: true },
  });



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
            <h1 className="page-title">Promotions</h1>
            <p className="page-subtitle">
              Discount codes, automatic discounts, and flash sales
            </p>
          </div>
          <Button
            size="sm"
            iconLeft={<Plus size={14} />}
            onClick={() => setShowNew(true)}
          >
            Create Discount
          </Button>
        </div>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: 5,
          background: "var(--bg-tertiary)",
          borderRadius: 14,
          border: "none",
          width: "fit-content",
          marginBottom: 24,
        }}
      >
        {(["codes", "flash"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "none",
              background:
                tab === t
                  ? "linear-gradient(135deg,var(--primary),var(--secondary))"
                  : "transparent",
              color: tab === t ? "white" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
            }}
          >
            {t === "codes" ? "Discount Codes" : "Flash Sales"}
          </button>
        ))}
      </div>

      {tab === "codes" &&
        (loading ? (
          <CenterSpinner />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {discounts.map((d) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    minWidth: 80,
                    padding: "6px 12px",
                    textAlign: "center",
                    borderRadius: 8,
                    background:
                      "linear-gradient(135deg,rgba(59,130,246,.15),rgba(139,92,246,.1))",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "var(--primary)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {d.type === "free_shipping"
                    ? "FREE SHIP"
                    : `${d.value}${d.type === "percentage" ? "%" : "$"} OFF`}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        fontFamily: "monospace",
                        letterSpacing: 1,
                      }}
                    >
                      {d.code}
                    </span>
                    <Badge variant={d.active ? "success" : "ghost"}>
                      {d.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {d.usageCount} used
                    {d.usageLimit ? ` / ${d.usageLimit} limit` : ""} · Applies
                    to {d.appliesTo.replace(/_/g, " ")}
                    {d.minimumAmount ? ` · Min $${d.minimumAmount}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(d.code)}
                    style={{
                      background: "none",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: "6px 10px",
                      fontSize: 11,
                    }}
                  >
                    Copy
                  </button>
                  <Toggle
                    checked={d.active}
                    onChange={(v) => update(d.id, { active: v })}
                  />
                  <button
                    onClick={() => {
                      if (confirm("Delete discount?")) remove(d.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--danger)",
                      padding: 4,
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {!discounts.length && (
              <EmptyPromo
                label="No discount codes yet"
                onClick={() => setShowNew(true)}
              />
            )}
          </div>
        ))}

      {tab === "flash" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {flashSales.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "16px 20px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(s.startsAt).toLocaleDateString()} →{" "}
                    {new Date(s.endsAt).toLocaleDateString()} ·{" "}
                    {s.discount.value}
                    {s.discount.type === "percentage" ? "%" : "$"} off ·{" "}
                    {s.products.length} products
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge variant={s.active ? "success" : "ghost"}>
                    {s.active ? "Live" : "Draft"}
                  </Badge>
                  <button
                    onClick={() => removeFlash(s.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--danger)",
                      padding: 4,
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!flashSales.length && (
            <EmptyPromo label="No flash sales running" onClick={() => {}} />
          )}
        </div>
      )}

      {/* New discount modal */}
      {showNew && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
        >
          <div className="modal modal-md">
            <div className="modal-header">
              <h3 className="modal-title">Create Discount Code</h3>
              <button
                onClick={() => setShowNew(false)}
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
              <Input
                label="Discount Code"
                value={newCode.code}
                onChange={(e) =>
                  setNewCode((n) => ({
                    ...n,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="SUMMER20"
                hint="Customers enter this at checkout"
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
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
                    Discount Type
                  </label>
                  <select
                    value={newCode.type}
                    onChange={(e) =>
                      setNewCode((n) => ({
                        ...n,
                        type: e.target.value as DiscountCode["type"],
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      fontFamily: "inherit",
                    }}
                  >
                    <option value="percentage">Percentage off</option>
                    <option value="fixed_amount">Fixed amount off</option>
                    <option value="free_shipping">Free shipping</option>
                    <option value="buy_x_get_y">Buy X Get Y</option>
                  </select>
                </div>
                {newCode.type !== "free_shipping" && (
                  <Input
                    label={
                      newCode.type === "percentage"
                        ? "Percentage (%)"
                        : "Amount ($)"
                    }
                    type="number"
                    value={newCode.value.toString()}
                    onChange={(e) =>
                      setNewCode((n) => ({
                        ...n,
                        value: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Input
                  label="Minimum Order Amount ($)"
                  type="number"
                  value={newCode.minimumAmount.toString()}
                  onChange={(e) =>
                    setNewCode((n) => ({
                      ...n,
                      minimumAmount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  hint="0 = no minimum"
                />
                <Input
                  label="Usage Limit"
                  type="number"
                  value={newCode.usageLimit.toString()}
                  onChange={(e) =>
                    setNewCode((n) => ({
                      ...n,
                      usageLimit: parseInt(e.target.value) || 0,
                    }))
                  }
                  hint="0 = unlimited"
                />
              </div>
              <Toggle
                label="One use per customer"
                checked={newCode.oncePerCustomer}
                onChange={(v) =>
                  setNewCode((n) => ({ ...n, oncePerCustomer: v }))
                }
              />
              <Toggle
                label="Active immediately"
                checked={newCode.active}
                onChange={(v) => setNewCode((n) => ({ ...n, active: v }))}
              />
            </div>
            <div className="modal-footer">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNew(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  create(newCode as any);
                  setShowNew(false);
                }}
              >
                Create Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyPromo({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        borderRadius: 12,
        border: "2px dashed var(--border)",
      }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>{label}</p>
      <Button
        size="sm"
        variant="outline"
        iconLeft={<Plus size={13} />}
        onClick={onClick}
      >
        Create one
      </Button>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  MEDIA LIBRARY PAGE
// ══════════════════════════════════════════════════════
export function MediaPage() {
  const { files, loading, upload, remove, updateAlt } =
    useMedia() as ReturnType<typeof useMedia> & {
      updateAlt: (id: string, alt: string) => Promise<void>;
    };
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSelect = (id: string) =>
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer.files;
    if (dt.length) upload(dt as any);
  };

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
            <h1 className="page-title">Media Library</h1>
            <p className="page-subtitle">{files.length} files</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {selected.size > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  Array.from(selected).forEach((id) => remove(id));
                  setSelected(new Set());
                }}
              >
                Delete {selected.size}
              </Button>
            )}
            <Button
              size="sm"
              iconLeft={<Upload size={14} />}
              onClick={() => inputRef.current?.click()}
            >
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && upload(e.target.files as any)}
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: "2px dashed var(--border)",
          borderRadius: 14,
          padding: "24px",
          textAlign: "center",
          marginBottom: 24,
          cursor: "pointer",
          transition: "all .2s",
        }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor =
            "var(--primary)")
        }
        onDragLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
        }
      >
        <Upload
          size={28}
          color="var(--text-muted)"
          style={{ margin: "0 auto 10px" }}
        />
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 14 }}>
          Drag & drop files here, or{" "}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            browse
          </span>
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            margin: "4px 0 0",
            fontSize: 12,
          }}
        >
          PNG, JPG, GIF, SVG, MP4 supported
        </p>
      </div>

      {loading ? (
        <CenterSpinner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                setPreview(file);
                setEditAlt(file.alt ?? "");
              }}
              style={{
                borderRadius: 12,
                border: `2px solid ${selected.has(file.id) ? "var(--primary)" : "var(--border)"}`,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                background: "var(--card-bg)",
                transition: "all .15s",
              }}
            >
              <div
                style={{
                  height: 130,
                  background: "var(--bg-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {file.mimeType.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Package size={40} color="var(--text-muted)" />
                )}
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.filename}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {(file.size / 1024).toFixed(0)} KB
                  {file.width ? ` · ${file.width}×${file.height}` : ""}
                </div>
              </div>
              <div style={{ position: "absolute", top: 6, left: 6 }}>
                <input
                  type="checkbox"
                  checked={selected.has(file.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(file.id)}
                  style={{
                    accentColor: "var(--primary)",
                    width: 16,
                    height: 16,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setPreview(null)}
        >
          <div className="modal modal-md">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">File Details</h3>
                <p className="modal-subtitle">{preview.filename}</p>
              </div>
              <button
                onClick={() => setPreview(null)}
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
            <div className="modal-body">
              {preview.mimeType.startsWith("image/") && (
                <div
                  style={{
                    height: 240,
                    background: "var(--bg-tertiary)",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={preview.url}
                    alt={preview.alt}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <InfoTile
                  label="Size"
                  value={`${(preview.size / 1024).toFixed(0)} KB`}
                />
                <InfoTile label="Type" value={preview.mimeType} />
                {preview.width && (
                  <InfoTile
                    label="Dimensions"
                    value={`${preview.width}×${preview.height}`}
                  />
                )}
                <InfoTile
                  label="Uploaded"
                  value={new Date(preview.createdAt).toLocaleDateString()}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Alt Text
                </label>
                <input
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  placeholder="Describe this image for accessibility and SEO"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text-primary)",
                    fontSize: 13,
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "var(--bg-tertiary)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-muted)",
                  wordBreak: "break-all",
                }}
              >
                <Link size={13} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{preview.url}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(preview.url)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--primary)",
                  }}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  remove(preview.id);
                  setPreview(null);
                }}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreview(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  updateAlt(preview.id, editAlt);
                  setPreview(null);
                }}
              >
                Save Alt Text
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  NAVIGATION BUILDER
// ══════════════════════════════════════════════════════
export function NavigationPage() {
  const { menus, loading, update } = useNavigation();
  const [active, setActive] = useState<NavMenu | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ label: "", url: "" });

  const addLink = () => {
    if (!active || !newItem.label) return;
    const item: NavLinkType = {
      id: Date.now().toString(),
      label: newItem.label,
      url: newItem.url,
      position: active.items.length + 1,
    };
    const updated = { ...active, items: [...active.items, item] };
    setActive(updated);
    update(active.id, updated);
    setNewItem({ label: "", url: "" });
    setAddingItem(false);
  };

  const removeLink = (id: string) => {
    if (!active) return;
    const updated = {
      ...active,
      items: active.items.filter((i) => i.id !== id),
    };
    setActive(updated);
    update(active.id, updated);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Navigation</h1>
        <p className="page-subtitle">Manage all menus across your storefront</p>
      </div>
      {loading ? (
        <CenterSpinner />
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}
        >
          {/* Menu list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "var(--text-muted)",
                padding: "0 4px",
                marginBottom: 6,
              }}
            >
              Menus
            </p>
            {menus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActive(menu)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1px solid ${active?.id === menu.id ? "var(--primary)" : "var(--border)"}`,
                  background:
                    active?.id === menu.id
                      ? "rgba(59,130,246,.08)"
                      : "var(--card-bg)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color:
                      active?.id === menu.id
                        ? "var(--primary)"
                        : "var(--text-primary)",
                  }}
                >
                  {menu.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {menu.handle} · {menu.items.length} items
                </div>
              </button>
            ))}
          </div>

          {/* Menu editor */}
          {active ? (
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h4 style={{ color: "var(--text-primary)", marginBottom: 4 }}>
                    {active.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    /{active.handle}
                  </p>
                </div>
                <Button
                  size="sm"
                  iconLeft={<Plus size={13} />}
                  onClick={() => setAddingItem(true)}
                >
                  Add Link
                </Button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {active.items.map((item) => (
                  <div key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        background: "var(--bg-tertiary)",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <GripVertical
                        size={16}
                        color="var(--text-muted)"
                        style={{ cursor: "grab" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{ fontSize: 11, color: "var(--text-muted)" }}
                        >
                          {item.url}
                        </div>
                      </div>
                      {item.children?.length && (
                        <Badge variant="ghost">
                          {item.children.length} children
                        </Badge>
                      )}
                      <button
                        onClick={() => removeLink(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--danger)",
                          padding: 4,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {/* Children */}
                    {item.children?.map((child) => (
                      <div
                        key={child.id}
                        style={{
                          marginLeft: 24,
                          marginTop: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          background: "var(--card-bg)",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                        }}
                      >
                        <ChevronRight size={12} color="var(--text-muted)" />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {child.label}
                          </div>
                          <div
                            style={{ fontSize: 11, color: "var(--text-muted)" }}
                          >
                            {child.url}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {addingItem && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: "var(--bg-tertiary)",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Add Navigation Link
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <Input
                      label="Label"
                      value={newItem.label}
                      onChange={(e) =>
                        setNewItem((n) => ({ ...n, label: e.target.value }))
                      }
                      placeholder="Shop"
                    />
                    <Input
                      label="URL"
                      value={newItem.url}
                      onChange={(e) =>
                        setNewItem((n) => ({ ...n, url: e.target.value }))
                      }
                      placeholder="/collections"
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button size="xs" onClick={addLink}>
                      Add Link
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setAddingItem(false);
                        setNewItem({ label: "", url: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <p style={{ color: "var(--text-muted)" }}>
                Select a menu to edit
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  SEO PAGE
// ══════════════════════════════════════════════════════
export function SEOPage() {
  const { seo, loading, update } = useGlobalSEO();
  const [form, setForm] = useState<any>(null);

  if (loading || !seo) return <CenterSpinner />;
  const f = form ?? seo;
  const set = (k: string, v: string) =>
    setForm((prev: any) => ({ ...(prev ?? seo), [k]: v }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SEO</h1>
        <p className="page-subtitle">
          Global SEO settings and meta configuration
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormCard title="Site Identity">
            <Input
              label="Site Name"
              value={f.siteName}
              onChange={(e) => set("siteName", e.target.value)}
            />
            <Input
              label="Title Template"
              value={f.titleTemplate}
              onChange={(e) => set("titleTemplate", e.target.value)}
              hint="Use {page} and {siteName} as variables"
            />
            <Input
              label="Default Page Title"
              value={f.defaultTitle}
              onChange={(e) => set("defaultTitle", e.target.value)}
            />
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
                Default Meta Description
              </label>
              <textarea
                value={f.defaultDescription}
                onChange={(e) => set("defaultDescription", e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  color:
                    (f.defaultDescription || "").length > 160
                      ? "var(--warning)"
                      : "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                {(f.defaultDescription || "").length}/160
              </p>
            </div>
            <Input
              label="Default OG Image URL"
              value={f.defaultOgImage}
              onChange={(e) => set("defaultOgImage", e.target.value)}
              placeholder="https://…/og-image.jpg"
              hint="1200×630px recommended"
            />
          </FormCard>

          <FormCard title="Social & Analytics">
            <Input
              label="Twitter Handle"
              value={f.twitterHandle ?? ""}
              onChange={(e) => set("twitterHandle", e.target.value)}
              placeholder="@yourbrand"
            />
            <Input
              label="Google Analytics ID"
              value={f.googleAnalyticsId ?? ""}
              onChange={(e) => set("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
            <Input
              label="Google Tag Manager ID"
              value={f.googleTagManagerId ?? ""}
              onChange={(e) => set("googleTagManagerId", e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
            <Input
              label="Facebook Pixel ID"
              value={f.facebookPixelId ?? ""}
              onChange={(e) => set("facebookPixelId", e.target.value)}
              placeholder="XXXXXXXXXXXXXXXX"
            />
          </FormCard>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormCard title="robots.txt">
            <textarea
              value={f.robots}
              onChange={(e) => set("robots", e.target.value)}
              rows={8}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-secondary)",
                fontSize: 12,
                fontFamily: "monospace",
                resize: "vertical",
              }}
            />
          </FormCard>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => update(f)}>Save SEO Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  THEME PAGE
// ══════════════════════════════════════════════════════
export function ThemePage() {
  const { themes, loading, update } = useThemes();
  const [active, setActiveTheme] = useState<StorefrontTheme | null>(null);
  const [tab, setTab] = useState<
    "colors" | "typography" | "layout" | "header" | "productCard"
  >("colors");

  const activeTheme = themes.find((t) => t.active) ?? themes[0];
  const editing = active ?? activeTheme;

  const setColor = (key: string, val: string) => {
    if (!editing) return;
    const updated = { ...editing, colors: { ...editing.colors, [key]: val } };
    setActiveTheme(updated);
    update(editing.id, { colors: updated.colors });
  };

  const COLOR_FIELDS: {
    key: keyof StorefrontTheme["colors"];
    label: string;
  }[] = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "accent", label: "Accent" },
    { key: "background", label: "Background" },
    { key: "surface", label: "Surface" },
    { key: "text", label: "Text" },
    { key: "textSecondary", label: "Text Secondary" },
    { key: "border", label: "Border" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "danger", label: "Danger" },
    { key: "buttonText", label: "Button Text" },
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
            <h1 className="page-title">Storefront Theme</h1>
            <p className="page-subtitle">
              Colors, typography, layout, and component styles
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            iconLeft={<ExternalLink size={14} />}
            onClick={() => window.open("/", "_blank")}
          >
            Preview
          </Button>
        </div>
      </div>

      {loading || !editing ? (
        <CenterSpinner />
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}
        >
          {/* Tab nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(
              [
                "colors",
                "typography",
                "layout",
                "header",
                "productCard",
              ] as const
            ).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${tab === t ? "var(--primary)" : "transparent"}`,
                  background:
                    tab === t ? "rgba(59,130,246,.08)" : "transparent",
                  color: tab === t ? "var(--primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                {t.charAt(0).toUpperCase() +
                  t.slice(1).replace(/([A-Z])/g, " $1")}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            {tab === "colors" && (
              <div>
                <h4 style={{ color: "var(--text-primary)", marginBottom: 20 }}>
                  Color Palette
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {COLOR_FIELDS.map((f) => (
                    <div key={f.key}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {f.label}
                      </label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <input
                          type="color"
                          value={editing.colors[f.key] ?? "#000000"}
                          onChange={(e) => setColor(f.key, e.target.value)}
                          style={{
                            width: 40,
                            height: 40,
                            border: "2px solid var(--border)",
                            borderRadius: 8,
                            cursor: "pointer",
                            padding: 2,
                          }}
                        />
                        <input
                          value={editing.colors[f.key] ?? ""}
                          onChange={(e) => setColor(f.key, e.target.value)}
                          style={{
                            flex: 1,
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg-tertiary)",
                            color: "var(--text-primary)",
                            fontSize: 12,
                            fontFamily: "monospace",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "typography" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
                  Typography
                </h4>
                <Input
                  label="Heading Font"
                  value={editing.typography.headingFont}
                  onChange={(e) =>
                    update(editing.id, {
                      typography: {
                        ...editing.typography,
                        headingFont: e.target.value,
                      },
                    })
                  }
                  hint="Google Fonts name or system font"
                />
                <Input
                  label="Body Font"
                  value={editing.typography.bodyFont}
                  onChange={(e) =>
                    update(editing.id, {
                      typography: {
                        ...editing.typography,
                        bodyFont: e.target.value,
                      },
                    })
                  }
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
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
                      Base Font Size (px)
                    </label>
                    <input
                      type="number"
                      value={editing.typography.baseFontSize}
                      onChange={(e) =>
                        update(editing.id, {
                          typography: {
                            ...editing.typography,
                            baseFontSize: parseInt(e.target.value) || 16,
                          },
                        })
                      }
                      min={12}
                      max={20}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--card-bg)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        fontFamily: "inherit",
                      }}
                    />
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
                      Line Height
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={editing.typography.lineHeight}
                      onChange={(e) =>
                        update(editing.id, {
                          typography: {
                            ...editing.typography,
                            lineHeight: parseFloat(e.target.value) || 1.6,
                          },
                        })
                      }
                      min={1}
                      max={2.5}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--card-bg)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {tab === "layout" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
                  Layout
                </h4>
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
                    Container Max Width (px): {editing.layout.containerMaxWidth}
                  </label>
                  <input
                    type="range"
                    min={960}
                    max={1920}
                    value={editing.layout.containerMaxWidth}
                    onChange={(e) =>
                      update(editing.id, {
                        layout: {
                          ...editing.layout,
                          containerMaxWidth: `${parseInt(e.target.value)}px`,
                        },
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
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
                    Grid Gap (px): {editing.layout.gridGap}
                  </label>
                  <input
                    type="range"
                    min={8}
                    max={48}
                    value={editing.layout.gridGap}
                    onChange={(e) =>
                      update(editing.id, {
                        layout: {
                          ...editing.layout,
                          gridGap: `${parseInt(e.target.value)}px`,
                        },
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
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
                    Section Spacing (px): {editing.layout.sectionSpacing}
                  </label>
                  <input
                    type="range"
                    min={32}
                    max={160}
                    value={editing.layout.sectionSpacing}
                    onChange={(e) =>
                      update(editing.id, {
                        layout: {
                          ...editing.layout,
                          sectionSpacing: `${parseInt(e.target.value)}px`,
                        },
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              </div>
            )}
            {tab === "header" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
                  Header
                </h4>
                <Toggle
                  label="Sticky Header"
                  checked={editing.header.sticky}
                  onChange={(v) =>
                    update(editing.id, {
                      header: { ...editing.header, sticky: v },
                    })
                  }
                />
                <Toggle
                  label="Transparent Header"
                  checked={editing.header.transparent}
                  description="Makes header transparent over hero image"
                  onChange={(v) =>
                    update(editing.id, {
                      header: { ...editing.header, transparent: v },
                    })
                  }
                />
                <Toggle
                  label="Show Search"
                  checked={editing.header.showSearch}
                  onChange={(v) =>
                    update(editing.id, {
                      header: { ...editing.header, showSearch: v },
                    })
                  }
                />
                <Toggle
                  label="Show Cart Icon"
                  checked={editing.header.showCart}
                  onChange={(v) =>
                    update(editing.id, {
                      header: { ...editing.header, showCart: v },
                    })
                  }
                />
                <Toggle
                  label="Show Account"
                  checked={editing.header.showAccount}
                  onChange={(v) =>
                    update(editing.id, {
                      header: { ...editing.header, showAccount: v },
                    })
                  }
                />
                <Toggle
                  label="Show Wishlist"
                  checked={editing.header.showWishlist}
                  onChange={(v) =>
                    update(editing.id, {
                      header: { ...editing.header, showWishlist: v },
                    })
                  }
                />
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
                    Header Height (px): {editing.header.height}
                  </label>
                  <input
                    type="range"
                    min={48}
                    max={100}
                    value={editing.header.height}
                    onChange={(e) =>
                      update(editing.id, {
                        header: {
                          ...editing.header,
                          height: `${parseInt(e.target.value)}px`,
                        },
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
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
                    Logo Max Width (px): {editing.header.logoMaxWidth}
                  </label>
                  <input
                    type="range"
                    min={80}
                    max={300}
                    value={editing.header.logoMaxWidth}
                    onChange={(e) =>
                      update(editing.id, {
                        header: {
                          ...editing.header,
                          logoMaxWidth: `${parseInt(e.target.value)}px`,
                        },
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              </div>
            )}
            {tab === "productCard" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
                  Product Cards
                </h4>
                <Toggle
                  label="Show Vendor"
                  checked={editing.productCard.showVendor}
                  onChange={(v) =>
                    update(editing.id, {
                      productCard: { ...editing.productCard, showVendor: v },
                    })
                  }
                />
                <Toggle
                  label="Show Rating"
                  checked={editing.productCard.showRating}
                  onChange={(v) =>
                    update(editing.id, {
                      productCard: { ...editing.productCard, showRating: v },
                    })
                  }
                />
                <Toggle
                  label="Show Color Swatches"
                  checked={editing.productCard.showSwatches}
                  onChange={(v) =>
                    update(editing.id, {
                      productCard: { ...editing.productCard, showSwatches: v },
                    })
                  }
                />
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
                    Hover Effect
                  </label>
                  <select
                    value={editing.productCard.hoverEffect}
                    onChange={(e) =>
                      update(editing.id, {
                        productCard: {
                          ...editing.productCard,
                          hoverEffect: e.target.value as any,
                        },
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      fontFamily: "inherit",
                    }}
                  >
                    <option value="none">None</option>
                    <option value="zoom">Zoom</option>
                    <option value="alt-image">Show Alt Image</option>
                    <option value="quick-add">Quick Add Button</option>
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
                    Image Aspect Ratio
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["1:1", "3:4", "4:3"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() =>
                          update(editing.id, {
                            productCard: {
                              ...editing.productCard,
                              aspectRatio: r,
                            },
                          })
                        }
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: 8,
                          border: `1px solid ${editing.productCard.aspectRatio === r ? "var(--primary)" : "var(--border)"}`,
                          background:
                            editing.productCard.aspectRatio === r
                              ? "rgba(59,130,246,.1)"
                              : "transparent",
                          color:
                            editing.productCard.aspectRatio === r
                              ? "var(--primary)"
                              : "var(--text-secondary)",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 13,
                          fontFamily: "inherit",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
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
                    Card Border Radius (px): {editing.productCard.borderRadius}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={editing.productCard.borderRadius}
                    onChange={(e) =>
                      update(editing.id, {
                        productCard: {
                          ...editing.productCard,
                          borderRadius: `${parseInt(e.target.value)}px`,
                        },
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  SETTINGS PAGE
// ══════════════════════════════════════════════════════
export function SettingsPage() {
  const {
    settings,
    loading,
    updateStore,
    updateCheckout,
    updateNotifications,
  } = useSettings() as ReturnType<typeof useSettings> & {
    updateStore: (d: any) => Promise<void>;
    updateCheckout: (d: any) => Promise<void>;
    updateNotifications: (d: any) => Promise<void>;
  };
  const [tab, setTab] = useState("store");

  const TABS = [
    { id: "store", label: "Store Info", icon: <SettingsIcon size={15} /> },
    { id: "shipping", label: "Shipping", icon: <Truck size={15} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={15} /> },
    { id: "checkout", label: "Checkout", icon: <ShoppingCart size={15} /> },
    { id: "notifications", label: "Emails", icon: <Bell size={15} /> },
  ];

  if (loading || !settings) return <CenterSpinner />;
  const s = settings as any;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Store configuration, shipping, payments, and more
        </p>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}
      >
        {/* Tab nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                borderRadius: 10,
                border: `1px solid ${tab === t.id ? "var(--primary)" : "transparent"}`,
                background:
                  tab === t.id ? "rgba(59,130,246,.08)" : "transparent",
                color:
                  tab === t.id ? "var(--primary)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 28,
          }}
        >
          {tab === "store" && (
            <StoreInfoForm store={s.store} onSave={updateStore} />
          )}
          {tab === "shipping" && <ShippingForm zones={s.shipping} />}
          {tab === "payments" && <PaymentsForm payments={s.payments} />}
          {tab === "checkout" && (
            <CheckoutForm checkout={s.checkout} onSave={updateCheckout} />
          )}
          {tab === "notifications" && (
            <NotificationsForm
              notifications={s.notifications}
              onSave={updateNotifications}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StoreInfoForm({
  store,
  onSave,
}: {
  store: any;
  onSave: (d: any) => void;
}) {
  const [f, setF] = useState(store);
  const set = (k: string, v: string) => setF((x: any) => ({ ...x, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
        Store Information
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Input
          label="Store Name"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <Input
          label="Contact Email"
          type="email"
          value={f.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <Input
          label="Phone"
          value={f.phone ?? ""}
          onChange={(e) => set("phone", e.target.value)}
        />
        <Input
          label="Domain"
          value={f.domain}
          onChange={(e) => set("domain", e.target.value)}
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}
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
            Currency
          </label>
          <select
            value={f.currency}
            onChange={(e) => set("currency", e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {["USD", "EUR", "GBP", "AUD", "CAD", "JPY"].map((c) => (
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
            Weight Unit
          </label>
          <select
            value={f.weightUnit}
            onChange={(e) => set("weightUnit", e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
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
            Timezone
          </label>
          <select
            value={f.timezone}
            onChange={(e) => set("timezone", e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {[
              "America/New_York",
              "America/Chicago",
              "America/Los_Angeles",
              "Europe/London",
              "Europe/Paris",
              "Asia/Tokyo",
              "Australia/Sydney",
            ].map((tz) => (
              <option key={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: "1px solid var(--border)",
        }}
      >
        <Button size="sm" onClick={() => onSave(f)}>
          Save Store Info
        </Button>
      </div>
    </div>
  );
}

function ShippingForm({ zones }: { zones: any[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
          Shipping Zones
        </h4>
        <Button size="sm" iconLeft={<Plus size={13} />}>
          Add Zone
        </Button>
      </div>
      {zones.map((zone: any) => (
        <div
          key={zone.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                {zone.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {zone.countries.join(", ")}
              </div>
            </div>
            <Button size="xs" variant="ghost" iconLeft={<Edit size={12} />}>
              Edit
            </Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {zone.rates.map((rate: any) => (
              <div
                key={rate.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "var(--bg-tertiary)",
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {rate.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {rate.price === 0 ? "Free" : `$${rate.price.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentsForm({ payments }: { payments: any[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
        Payment Providers
      </h4>
      {payments.map((p: any) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 20px",
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background:
                "linear-gradient(135deg,rgba(59,130,246,.1),rgba(139,92,246,.1))",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCard size={20} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {p.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {p.testMode ? "Test Mode" : "Live Mode"} · {p.provider}
            </div>
          </div>
          <Toggle checked={p.enabled} onChange={() => {}} />
          <Button size="xs" variant="outline">
            Configure
          </Button>
        </div>
      ))}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          border: "2px dashed var(--border)",
          borderRadius: 12,
          background: "transparent",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontFamily: "inherit",
          fontSize: 13,
          width: "100%",
        }}
      >
        <Plus size={16} /> Add Payment Provider
      </button>
    </div>
  );
}

function CheckoutForm({
  checkout,
  onSave,
}: {
  checkout: any;
  onSave: (d: any) => void;
}) {
  const [f, setF] = useState(checkout);
  const toggle = (k: string) => setF((x: any) => ({ ...x, [k]: !x[k] }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
        Checkout Settings
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Toggle
          label="Allow Guest Checkout"
          checked={f.allowGuestCheckout}
          onChange={() => toggle("allowGuestCheckout")}
        />
        <Toggle
          label="Require Account"
          checked={f.requiresAccount}
          onChange={() => toggle("requiresAccount")}
        />
        <Toggle
          label="Show Company Field"
          checked={f.showCompanyField}
          onChange={() => toggle("showCompanyField")}
        />
        <Toggle
          label="Show Phone Field"
          checked={f.showPhoneField}
          onChange={() => toggle("showPhoneField")}
        />
        <Toggle
          label="Require Phone"
          checked={f.requirePhone}
          onChange={() => toggle("requirePhone")}
        />
        <Toggle
          label="Enable Order Notes"
          checked={f.noteEnabled}
          onChange={() => toggle("noteEnabled")}
        />
        <Toggle
          label="Enable Tipping"
          checked={f.tippingEnabled}
          onChange={() => toggle("tippingEnabled")}
        />
        <Toggle
          label="Abandoned Cart Recovery"
          checked={f.abandonedCartRecovery}
          onChange={() => toggle("abandonedCartRecovery")}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          paddingTop: 8,
          borderTop: "1px solid var(--border)",
        }}
      >
        <Input
          label="Terms Page URL"
          value={f.termsUrl ?? ""}
          onChange={(e) =>
            setF((x: any) => ({ ...x, termsUrl: e.target.value }))
          }
          placeholder="/pages/terms"
        />
        <Input
          label="Privacy Page URL"
          value={f.privacyUrl ?? ""}
          onChange={(e) =>
            setF((x: any) => ({ ...x, privacyUrl: e.target.value }))
          }
          placeholder="/pages/privacy"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: "1px solid var(--border)",
        }}
      >
        <Button size="sm" onClick={() => onSave(f)}>
          Save Checkout Settings
        </Button>
      </div>
    </div>
  );
}

function NotificationsForm({
  notifications,
  onSave,
}: {
  notifications: any;
  onSave: (d: any) => void;
}) {
  const [f, setF] = useState(notifications);
  const toggle = (k: string) => setF((x: any) => ({ ...x, [k]: !x[k] }));
  const TOGGLES = [
    { key: "orderConfirmation", label: "Order Confirmation" },
    { key: "orderShipped", label: "Order Shipped" },
    { key: "orderDelivered", label: "Order Delivered" },
    { key: "orderCancelled", label: "Order Cancelled" },
    { key: "refundProcessed", label: "Refund Processed" },
    { key: "customerWelcome", label: "Customer Welcome" },
    { key: "passwordReset", label: "Password Reset" },
    { key: "abandonedCart", label: "Abandoned Cart Recovery" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h4 style={{ color: "var(--text-primary)", margin: 0 }}>
        Email Notifications
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <Input
          label="Sender Name"
          value={f.senderName}
          onChange={(e) =>
            setF((x: any) => ({ ...x, senderName: e.target.value }))
          }
        />
        <Input
          label="Sender Email"
          type="email"
          value={f.senderEmail}
          onChange={(e) =>
            setF((x: any) => ({ ...x, senderEmail: e.target.value }))
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TOGGLES.map((t) => (
          <Toggle
            key={t.key}
            label={t.label}
            checked={f[t.key]}
            onChange={() => toggle(t.key)}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: "1px solid var(--border)",
        }}
      >
        <Button size="sm" onClick={() => onSave(f)}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────

function CenterSpinner() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}
    >
      <Spinner size="lg" />
    </div>
  );
}

function FormCard({
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
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <h5
        style={{ color: "var(--text-primary)", marginBottom: 16, fontSize: 15 }}
      >
        {title}
      </h5>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}
