import { useState } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Eye,
  Package,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { useProducts, useCollections } from "./hooks";
import {
  Button,
  Badge,
  Avatar,
  DataTable,
  Spinner,
  Input,
  Toggle,
  Dropdown,
  type Column,
} from "../components/ui/index";
import type { Product } from "./types";

const STATUS_BADGE: Record<string, "success" | "ghost" | "danger"> = {
  active: "success",
  draft: "ghost",
  archived: "danger",
};

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editProduct, setEdit] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const { products, total, totalPages, loading, remove, bulkStatus } =
    useProducts({
      search,
      status: (statusFilter as Product["status"]) || undefined,
      page,
      limit: 12,
    });
  const { collections } = useCollections();

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected(
      selected.size === products.length
        ? new Set()
        : new Set(products.map((p: Product) => p.id)),
    );

  const columns: Column<Product>[] = [
    {
      key: "title",
      header: "Product",
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              overflow: "hidden",
              flexShrink: 0,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            {row.images[0] ? (
              <img
                src={row.images[0].url}
                alt={row.images[0].alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Package
                size={20}
                style={{
                  margin: "12px auto",
                  display: "block",
                  color: "var(--text-muted)",
                }}
              />
            )}
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "var(--text-primary)",
                fontSize: 14,
              }}
            >
              {row.title}
            </div>
            <div
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
            >
              {row.variants.length} variant
              {row.variants.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <Badge variant={STATUS_BADGE[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "inventory",
      header: "Inventory",
      sortable: false,
      align: "center",
      cell: (row) => {
        const total = row.variants.reduce((s, v) => s + v.inventory, 0);
        return (
          <span
            style={{
              fontWeight: 700,
              color:
                total < 5
                  ? "var(--danger)"
                  : total < 20
                    ? "var(--warning)"
                    : "var(--text-primary)",
            }}
          >
            {total}
          </span>
        );
      },
    },
    {
      key: "variants",
      header: "Price",
      align: "right",
      cell: (row) => {
        const prices = row.variants.map((v) => v.price);
        const min = Math.min(...prices),
          max = Math.max(...prices);
        return (
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {min === max
              ? `$${min.toFixed(2)}`
              : `$${min.toFixed(2)} – $${max.toFixed(2)}`}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Added",
      sortable: true,
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
              id: "edit",
              label: "Edit",
              icon: <Edit size={14} />,
              onClick: () => {
                setEdit(row);
                setShowForm(true);
              },
            },
            {
              id: "view",
              label: "View on store",
              icon: <Eye size={14} />,
              onClick: () => window.open(`/products/${row.handle}`, "_blank"),
            },
            { id: "duplicate", label: "Duplicate", icon: <Copy size={14} /> },
            { id: "div", label: "", divider: true, onClick: () => {} },
            {
              id: "delete",
              label: "Delete",
              icon: <Trash2 size={14} />,
              danger: true,
              onClick: () => {
                if (confirm("Delete this product?")) remove(row.id);
              },
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
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">{total} products in your store</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" size="sm" iconLeft={<Upload size={15} />}>
              Import
            </Button>
            <Button variant="ghost" size="sm" iconLeft={<Download size={15} />}>
              Export
            </Button>
            <Button
              size="sm"
              iconLeft={<Plus size={15} />}
              onClick={() => {
                setEdit(null);
                setShowForm(true);
              }}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
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
            placeholder="Search products…"
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
        {(["all", "active", "draft", "archived"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s === "all" ? "" : s)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${(statusFilter || "all") === s ? "var(--primary)" : "var(--border)"}`,
              background:
                (statusFilter || "all") === s
                  ? "rgba(59,130,246,.1)"
                  : "var(--card-bg)",
              color:
                (statusFilter || "all") === s
                  ? "var(--primary)"
                  : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            background: "rgba(59,130,246,.08)",
            border: "1px solid rgba(59,130,246,.2)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ fontWeight: 600, color: "var(--primary)", fontSize: 14 }}
          >
            {selected.size} selected
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              size="xs"
              variant="outline"
              onClick={() => bulkStatus(Array.from(selected), "active")}
            >
              Set Active
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => bulkStatus(Array.from(selected), "draft")}
            >
              Set Draft
            </Button>
            <Button
              size="xs"
              variant="danger"
              onClick={() => {
                if (confirm(`Delete ${selected.size} products?`)) {
                  Array.from(selected).forEach((id) => remove(id));
                  setSelected(new Set());
                }
              }}
            >
              Delete
            </Button>
          </div>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            Clear
          </button>
        </div>
      )}

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
          data={products}
          searchable={false}
          pageSize={12}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          collections={collections}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  collections,
  onClose,
}: {
  product: Product | null;
  collections: any[];
  onClose: () => void;
}) {
  const { create, update } = useProducts();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: product?.title ?? "",
    handle: product?.handle ?? "",
    description: product?.description ?? "",
    status: product?.status ?? ("draft" as Product["status"]),
    vendor: product?.vendor ?? "",
    productType: product?.productType ?? "",
    tags: product?.tags.join(", ") ?? "",
    seoTitle: product?.seo.title ?? "",
    seoDesc: product?.seo.description ?? "",
    price: product?.variants[0]?.price?.toString() ?? "",
    sku: product?.variants[0]?.sku ?? "",
    inventory: product?.variants[0]?.inventory?.toString() ?? "",
    collections: product?.collections ?? ([] as string[]),
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const data: Partial<Product> = {
      title: form.title,
      handle:
        form.handle ||
        form.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      description: form.description,
      status: form.status,
      vendor: form.vendor,
      productType: form.productType,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      collections: form.collections,
      seo: { title: form.seoTitle, description: form.seoDesc },
      options: [],
      images: [],
      variants: [
        {
          id: product?.variants[0]?.id ?? "",
          productId: product?.id ?? "",
          title: "Default",
          sku: form.sku,
          price: parseFloat(form.price) || 0,
          inventory: parseInt(form.inventory) || 0,
          inventoryPolicy: "deny" as const,
          requiresShipping: true,
          taxable: true,
          options: {},
          position: 1,
          createdAt: "",
          updatedAt: "",
        },
      ],
    };
    try {
      if (product) await update(product.id, data);
      else await create(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal modal-xl"
        style={{
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {product ? "Edit Product" : "Add Product"}
            </h3>
            <p className="modal-subtitle">
              {product ? `Editing "${product.title}"` : "Create a new product"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              {product ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
        <div
          className="modal-body"
          style={{
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionCard title="Basic Information">
              <Input
                label="Product Title"
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!product)
                    set(
                      "handle",
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    );
                }}
                placeholder="e.g. Classic White T-Shirt"
              />
              <Input
                label="Handle (URL)"
                value={form.handle}
                onChange={(e) => set("handle", e.target.value)}
                placeholder="classic-white-t-shirt"
                hint="Used in the product URL: /products/handle"
              />
              <div>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={5}
                  placeholder="Describe your product…"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>
            </SectionCard>

            <SectionCard title="Pricing & Inventory">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <Input
                  label="Price ($)"
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0.00"
                />
                <Input
                  label="SKU"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="ABC-123"
                />
                <Input
                  label="Inventory"
                  type="number"
                  value={form.inventory}
                  onChange={(e) => set("inventory", e.target.value)}
                  placeholder="0"
                />
              </div>
            </SectionCard>

            <SectionCard title="SEO">
              <Input
                label="SEO Title"
                value={form.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder={form.title}
                hint="Shown in search engine results"
              />
              <div>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  SEO Description
                </label>
                <textarea
                  value={form.seoDesc}
                  onChange={(e) => set("seoDesc", e.target.value)}
                  rows={3}
                  placeholder="A brief description for search engines…"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color:
                      form.seoDesc.length > 160
                        ? "var(--warning)"
                        : "var(--text-muted)",
                    marginTop: 6,
                  }}
                >
                  {form.seoDesc.length}/160 characters
                </p>
              </div>
            </SectionCard>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionCard title="Status">
              {(["active", "draft", "archived"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${form.status === s ? "var(--primary)" : "var(--border)"}`,
                    background:
                      form.status === s
                        ? "rgba(59,130,246,.08)"
                        : "transparent",
                    cursor: "pointer",
                    marginBottom: 6,
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: `2px solid ${form.status === s ? "var(--primary)" : "var(--border)"}`,
                      background:
                        form.status === s ? "var(--primary)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {form.status === s && <Check size={10} color="white" />}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        form.status === s
                          ? "var(--primary)"
                          : "var(--text-secondary)",
                      textTransform: "capitalize",
                    }}
                  >
                    {s}
                  </span>
                </button>
              ))}
            </SectionCard>

            <SectionCard title="Collections">
              {collections.map((col) => (
                <label
                  key={col.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    padding: "6px 0",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.collections.includes(col.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...form.collections, col.id]
                        : form.collections.filter((id) => id !== col.id);
                      setForm((f) => ({ ...f, collections: updated }));
                    }}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    {col.title}
                  </span>
                </label>
              ))}
            </SectionCard>

            <SectionCard title="Organization">
              <Input
                label="Vendor"
                value={form.vendor}
                onChange={(e) => set("vendor", e.target.value)}
                placeholder="Brand name"
              />
              <Input
                label="Product Type"
                value={form.productType}
                onChange={(e) => set("productType", e.target.value)}
                placeholder="e.g. T-Shirts"
              />
              <Input
                label="Tags"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="summer, sale, new"
                hint="Comma-separated"
              />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionCard({
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
        style={{ marginBottom: 16, color: "var(--text-primary)", fontSize: 14 }}
      >
        {title}
      </h5>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}
