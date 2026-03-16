import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Megaphone,
  Layout,
  Star,
  Mail,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import { useContent } from "./hooks";
import { Button, Badge, Toggle, Input, Spinner } from "./components/ui";
import type { HeroSlide, TestimonialItem, FeaturedCollection } from "./types";

type ContentSection =
  | "announcement"
  | "hero"
  | "featured"
  | "testimonials"
  | "newsletter"
  | "pages"
  | "blog";

const SECTIONS: {
  id: ContentSection;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    id: "announcement",
    label: "Announcement Bar",
    icon: <Megaphone size={16} />,
    desc: "Top-of-site banner with link and colours",
  },
  {
    id: "hero",
    label: "Hero / Carousel",
    icon: <Layout size={16} />,
    desc: "Main hero slider with images, headlines, CTAs",
  },
  {
    id: "featured",
    label: "Featured Collections",
    icon: <ImageIcon size={16} />,
    desc: "Highlighted product collections on homepage",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: <Star size={16} />,
    desc: "Customer reviews displayed on the homepage",
  },
  {
    id: "newsletter",
    label: "Newsletter Section",
    icon: <Mail size={16} />,
    desc: "Email signup block with integration support",
  },
  {
    id: "pages",
    label: "Content Pages",
    icon: <FileText size={16} />,
    desc: "Static pages: About, FAQ, Returns, etc.",
  },
  {
    id: "blog",
    label: "Blog Posts",
    icon: <FileText size={16} />,
    desc: "Blog articles for SEO and customer education",
  },
];

export function ContentPage() {
  const { content, loading, saving, save } = useContent();
  const [active, setActive] = useState<ContentSection>("announcement");

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}
      >
        <Spinner size="lg" />
      </div>
    );

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
            <h1 className="page-title">Storefront Content</h1>
            <p className="page-subtitle">
              Edit every section of your storefront — changes publish instantly
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            iconLeft={<ExternalLink size={14} />}
            onClick={() => window.open("/", "_blank")}
          >
            Preview Store
          </Button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}
      >
        {/* Section nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                borderRadius: 10,
                border: `1px solid ${active === s.id ? "var(--primary)" : "transparent"}`,
                background:
                  active === s.id ? "rgba(59,130,246,.08)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                fontFamily: "inherit",
                color:
                  active === s.id ? "var(--primary)" : "var(--text-secondary)",
                transition: "all .15s ease",
              }}
            >
              <span style={{ opacity: active === s.id ? 1 : 0.6 }}>
                {s.icon}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Editor panel */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 28,
            minHeight: 500,
          }}
        >
          {saving && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                padding: "8px 14px",
                borderRadius: 8,
                background: "rgba(59,130,246,.1)",
                border: "1px solid rgba(59,130,246,.2)",
                fontSize: 13,
                color: "var(--primary)",
              }}
            >
              <Spinner size="sm" /> Saving…
            </div>
          )}

          {active === "announcement" && (
            <AnnouncementEditor
              content={content}
              onSave={(d) => save("announcementBar", d)}
            />
          )}
          {active === "hero" && (
            <HeroEditor content={content} onSave={(d) => save("hero", d)} />
          )}
          {active === "featured" && (
            <FeaturedEditor
              content={content}
              onSave={(d) => save("featuredCollections", d)}
            />
          )}
          {active === "testimonials" && (
            <TestimonialsEditor
              content={content}
              onSave={(d) => save("testimonials", d)}
            />
          )}
          {active === "newsletter" && (
            <NewsletterEditor
              content={content}
              onSave={(d) => save("newsletter", d)}
            />
          )}
          {active === "pages" && <PagesEditor />}
          {active === "blog" && <BlogEditor />}
        </div>
      </div>
    </div>
  );
}

// ── Announcement Bar ─────────────────────────────────
function AnnouncementEditor({
  content,
  onSave,
}: {
  content: any;
  onSave: (d: any) => void;
}) {
  const [form, setForm] = useState({ ...content.announcementBar });
  const set = (k: string, v: unknown) =>
    setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHead
        title="Announcement Bar"
        desc="Shown above the header on all pages"
      />
      <Toggle
        label="Enable Announcement Bar"
        checked={form.enabled}
        onChange={(v) => set("enabled", v)}
      />
      <Input
        label="Announcement Text"
        value={form.text}
        onChange={(e) => set("text", e.target.value)}
        placeholder="Free shipping on orders over $75!"
      />
      <Input
        label="Link URL (optional)"
        value={form.link ?? ""}
        onChange={(e) => set("link", e.target.value)}
        placeholder="/collections/sale"
        hint="Leave empty to show text only"
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ColorField
          label="Background Color"
          value={form.backgroundColor}
          onChange={(v) => set("backgroundColor", v)}
        />
        <ColorField
          label="Text Color"
          value={form.textColor}
          onChange={(v) => set("textColor", v)}
        />
      </div>
      <Toggle
        label="Allow customers to dismiss"
        description="Shows an × button on the bar"
        checked={form.dismissible}
        onChange={(v) => set("dismissible", v)}
      />
      <SaveBar onSave={() => onSave(form)} />
    </div>
  );
}

// ── Hero / Carousel ───────────────────────────────────
function HeroEditor({
  content,
  onSave,
}: {
  content: any;
  onSave: (d: any) => void;
}) {
  const [form, setForm] = useState({ ...content.hero });
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const set = (k: string, v: unknown) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  const addSlide = () => {
    const slide: HeroSlide = {
      id: Date.now().toString(),
      image: "",
      headline: "New Slide",
      position: form.slides.length + 1,
    };
    setForm((f: any) => ({ ...f, slides: [...f.slides, slide] }));
    setEditSlide(slide);
  };

  const removeSlide = (id: string) =>
    setForm((f: any) => ({
      ...f,
      slides: f.slides.filter((s: HeroSlide) => s.id !== id),
    }));

  const updateSlide = (id: string, data: Partial<HeroSlide>) => {
    setForm((f: any) => ({
      ...f,
      slides: f.slides.map((s: HeroSlide) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHead
        title="Hero Carousel"
        desc="Full-width banner on your homepage"
      />

      {/* Slides list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Slides ({form.slides.length})
          </label>
          <Button size="xs" iconLeft={<Plus size={12} />} onClick={addSlide}>
            Add Slide
          </Button>
        </div>
        {form.slides.map((slide: HeroSlide) => (
          <div
            key={slide.id}
            style={{
              border: `1px solid ${editSlide?.id === slide.id ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                cursor: "pointer",
                background:
                  editSlide?.id === slide.id
                    ? "rgba(59,130,246,.05)"
                    : "transparent",
              }}
              onClick={() =>
                setEditSlide(editSlide?.id === slide.id ? null : slide)
              }
            >
              <GripVertical size={16} color="var(--text-muted)" />
              {slide.image ? (
                <img
                  src={slide.image}
                  alt=""
                  style={{
                    width: 64,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 40,
                    background: "var(--bg-tertiary)",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageIcon size={16} color="var(--text-muted)" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                >
                  {slide.headline || "Untitled Slide"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {slide.ctaLabel ? `CTA: "${slide.ctaLabel}"` : "No CTA set"}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSlide(slide.id);
                }}
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
              {editSlide?.id === slide.id ? (
                <ChevronUp size={16} color="var(--text-muted)" />
              ) : (
                <ChevronDown size={16} color="var(--text-muted)" />
              )}
            </div>
            {editSlide?.id === slide.id && (
              <div
                style={{
                  padding: "16px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <Input
                  label="Image URL"
                  value={slide.image}
                  onChange={(e) =>
                    updateSlide(slide.id, { image: e.target.value })
                  }
                  placeholder="https://… or upload"
                />
                <Input
                  label="Mobile Image URL (optional)"
                  value={slide.mobileImage ?? ""}
                  onChange={(e) =>
                    updateSlide(slide.id, { mobileImage: e.target.value })
                  }
                />
                <Input
                  label="Headline"
                  value={slide.headline}
                  onChange={(e) =>
                    updateSlide(slide.id, { headline: e.target.value })
                  }
                  placeholder="New Collection"
                />
                <Input
                  label="Subheadline (optional)"
                  value={slide.subheadline ?? ""}
                  onChange={(e) =>
                    updateSlide(slide.id, { subheadline: e.target.value })
                  }
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Input
                    label="CTA Button Label"
                    value={slide.ctaLabel ?? ""}
                    onChange={(e) =>
                      updateSlide(slide.id, { ctaLabel: e.target.value })
                    }
                    placeholder="Shop Now"
                  />
                  <Input
                    label="CTA URL"
                    value={slide.ctaUrl ?? ""}
                    onChange={(e) =>
                      updateSlide(slide.id, { ctaUrl: e.target.value })
                    }
                    placeholder="/collections"
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Input
                    label="Secondary CTA Label"
                    value={slide.cta2Label ?? ""}
                    onChange={(e) =>
                      updateSlide(slide.id, { cta2Label: e.target.value })
                    }
                  />
                  <Input
                    label="Secondary CTA URL"
                    value={slide.cta2Url ?? ""}
                    onChange={(e) =>
                      updateSlide(slide.id, { cta2Url: e.target.value })
                    }
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
                    Overlay Opacity: {slide.overlay ?? 40}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    value={slide.overlay ?? 40}
                    onChange={(e) =>
                      updateSlide(slide.id, {
                        overlay: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global options */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          paddingTop: 8,
          borderTop: "1px solid var(--border)",
        }}
      >
        <Toggle
          label="Autoplay"
          checked={form.autoplay}
          onChange={(v) => set("autoplay", v)}
        />
        <Toggle
          label="Show Dots"
          checked={form.showDots}
          onChange={(v) => set("showDots", v)}
        />
        <Toggle
          label="Show Arrows"
          checked={form.showArrows}
          onChange={(v) => set("showArrows", v)}
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
          Height
        </label>
        <select
          value={form.height}
          onChange={(e) => set("height", e.target.value)}
          style={{
            padding: "9px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          {["full", "large", "medium", "small"].map((h) => (
            <option key={h} value={h}>
              {h.charAt(0).toUpperCase() + h.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <SaveBar onSave={() => onSave(form)} />
    </div>
  );
}

// ── Featured Collections ───────────────────────────────
function FeaturedEditor({
  content,
  onSave,
}: {
  content: any;
  onSave: (d: any) => void;
}) {
  const [sections, setSections] = useState<FeaturedCollection[]>(
    content.featuredCollections,
  );
  const add = () =>
    setSections((s) => [
      ...s,
      {
        enabled: true,
        title: "Featured Products",
        collectionId: "",
        displayCount: 8,
        layout: "grid",
        showViewAll: true,
      },
    ]);
  const remove = (i: number) =>
    setSections((s) => s.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: unknown) =>
    setSections((s) =>
      s.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)),
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHead
        title="Featured Collections"
        desc="Curated product sections on your homepage"
      />
      {sections.map((sec, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Toggle
              label="Enabled"
              checked={sec.enabled}
              onChange={(v) => update(i, "enabled", v)}
            />
            <button
              onClick={() => remove(i)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--danger)",
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              label="Section Title"
              value={sec.title}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="Shop by Category"
            />
            <Input
              label="Collection ID"
              value={sec.collectionId}
              onChange={(e) => update(i, "collectionId", e.target.value)}
              placeholder="col1"
              hint="ID of the collection to display"
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
                  Display Count
                </label>
                <input
                  type="number"
                  value={sec.displayCount}
                  onChange={(e) =>
                    update(i, "displayCount", parseInt(e.target.value))
                  }
                  min={1}
                  max={24}
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
                  Layout
                </label>
                <select
                  value={sec.layout}
                  onChange={(e) => update(i, "layout", e.target.value)}
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
                  <option value="grid">Grid</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>
            </div>
            <Toggle
              label="Show View All button"
              checked={sec.showViewAll}
              onChange={(v) => update(i, "showViewAll", v)}
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        iconLeft={<Plus size={13} />}
        onClick={add}
      >
        Add Section
      </Button>
      <SaveBar onSave={() => onSave(sections)} />
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────
function TestimonialsEditor({
  content,
  onSave,
}: {
  content: any;
  onSave: (d: any) => void;
}) {
  const [items, setItems] = useState<TestimonialItem[]>(content.testimonials);
  const add = () =>
    setItems((s) => [
      ...s,
      {
        id: Date.now().toString(),
        author: "",
        text: "",
        rating: 5,
        active: true,
      },
    ]);
  const remove = (id: string) => setItems((s) => s.filter((t) => t.id !== id));
  const update = (id: string, k: string, v: unknown) =>
    setItems((s) => s.map((t) => (t.id === id ? { ...t, [k]: v } : t)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHead
        title="Testimonials"
        desc="Customer reviews shown on your homepage"
      />
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Toggle
              label="Active"
              checked={t.active}
              onChange={(v) => update(t.id, "active", v)}
            />
            <button
              onClick={() => remove(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--danger)",
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <Input
                label="Author Name"
                value={t.author}
                onChange={(e) => update(t.id, "author", e.target.value)}
                placeholder="Jane D."
              />
              <Input
                label="Role (optional)"
                value={t.role ?? ""}
                onChange={(e) => update(t.id, "role", e.target.value)}
                placeholder="Verified Buyer"
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Review Text
              </label>
              <textarea
                value={t.text}
                onChange={(e) => update(t.id, "text", e.target.value)}
                rows={2}
                placeholder="Amazing product, will order again!"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "vertical",
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
                  marginBottom: 6,
                }}
              >
                Rating
              </label>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => update(t.id, "rating", r)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 20,
                      color: r <= t.rating ? "#f59e0b" : "var(--border)",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        iconLeft={<Plus size={13} />}
        onClick={add}
      >
        Add Testimonial
      </Button>
      <SaveBar onSave={() => onSave(items)} />
    </div>
  );
}

// ── Newsletter ────────────────────────────────────────
function NewsletterEditor({
  content,
  onSave,
}: {
  content: any;
  onSave: (d: any) => void;
}) {
  const [form, setForm] = useState({ ...content.newsletter });
  const set = (k: string, v: unknown) =>
    setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        title="Newsletter Section"
        desc="Email signup block with third-party integrations"
      />
      <Toggle
        label="Enable Newsletter Section"
        checked={form.enabled}
        onChange={(v) => set("enabled", v)}
      />
      <Input
        label="Heading"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        placeholder="Join our community"
      />
      <Input
        label="Subheading (optional)"
        value={form.subtitle ?? ""}
        onChange={(e) => set("subtitle", e.target.value)}
        placeholder="Get exclusive deals first"
      />
      <Input
        label="Input Placeholder"
        value={form.placeholder}
        onChange={(e) => set("placeholder", e.target.value)}
        placeholder="Enter your email"
      />
      <Input
        label="Button Label"
        value={form.buttonLabel}
        onChange={(e) => set("buttonLabel", e.target.value)}
        placeholder="Subscribe"
      />
      <Input
        label="Background Image URL (optional)"
        value={form.backgroundImage ?? ""}
        onChange={(e) => set("backgroundImage", e.target.value)}
      />
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Integrations (optional)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Input
            label="Klaviyo List ID"
            value={form.klaviyoListId ?? ""}
            onChange={(e) => set("klaviyoListId", e.target.value)}
            placeholder="ABC123"
          />
          <Input
            label="Mailchimp Tag"
            value={form.mailchimpTag ?? ""}
            onChange={(e) => set("mailchimpTag", e.target.value)}
            placeholder="newsletter-signup"
          />
        </div>
      </div>
      <SaveBar onSave={() => onSave(form)} />
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────
function PagesEditor() {
  const { content } = useContent();
  const pages = content?.pages ?? [];
  const [showNew, setShowNew] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SectionHead
          title="Content Pages"
          desc="Static pages like About, FAQ, Returns"
        />
        <Button
          size="sm"
          iconLeft={<Plus size={13} />}
          onClick={() => setShowNew(true)}
        >
          New Page
        </Button>
      </div>
      {pages.map((page: import("./types").ContentPage) => (
        <div
          key={page.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
          }}
        >
          <FileText size={16} color="var(--text-muted)" />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {page.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              /pages/{page.handle}
            </div>
          </div>
          <Badge variant={page.published ? "success" : "ghost"}>
            {page.published ? "Published" : "Draft"}
          </Badge>
          <Button size="xs" variant="ghost" iconLeft={<Edit size={12} />}>
            Edit
          </Button>
        </div>
      ))}
      {!pages.length && (
        <EmptyState
          label="No pages yet"
          action="Create your first page"
          onClick={() => setShowNew(true)}
        />
      )}
    </div>
  );
}

function BlogEditor() {
  return (
    <div>
      <SectionHead
        title="Blog Posts"
        desc="Articles for SEO and customer education"
      />
      <EmptyState
        label="Blog management coming soon"
        action=""
        onClick={() => {}}
      />
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────
function SectionHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 6,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div
      style={{
        paddingTop: 16,
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Button size="sm" onClick={onSave}>
        Save Changes
      </Button>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
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
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 44,
            height: 44,
            border: "2px solid var(--border)",
            borderRadius: 8,
            cursor: "pointer",
            padding: 2,
          }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            fontSize: 13,
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  );
}

function EmptyState({
  label,
  action,
  onClick,
}: {
  label: string;
  action: string;
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
      {action && (
        <Button
          size="sm"
          variant="outline"
          iconLeft={<Plus size={13} />}
          onClick={onClick}
        >
          {action}
        </Button>
      )}
    </div>
  );
}
