import type { BlogPost, Category, Product, Service } from '../../types';
import { Field, ToggleField, areaClass, textInputClass } from './AdminShell';

const parseCommaSeparated = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const stringifyCommaSeparated = (values: string[]) => values.join(', ');

const parseLineList = (value: string) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

export function ProductDraftForm({
  draft,
  categories,
  onChange,
}: {
  draft: Product;
  categories: Category[];
  onChange: (draft: Product) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Title">
        <input className={textInputClass()} value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={textInputClass()} value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} />
      </Field>
      <Field label="Category">
        <select className={textInputClass()} value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })}>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Brand">
        <input className={textInputClass()} value={draft.brand} onChange={(event) => onChange({ ...draft, brand: event.target.value })} />
      </Field>
      <Field label="Price">
        <input className={textInputClass()} type="number" value={draft.price} onChange={(event) => onChange({ ...draft, price: Number(event.target.value) })} />
      </Field>
      <Field label="Old price">
        <input
          className={textInputClass()}
          type="number"
          value={draft.oldPrice ?? ''}
          onChange={(event) => onChange({ ...draft, oldPrice: event.target.value ? Number(event.target.value) : undefined })}
        />
      </Field>
      <Field label="Stock">
        <input className={textInputClass()} type="number" value={draft.stock} onChange={(event) => onChange({ ...draft, stock: Number(event.target.value) })} />
      </Field>
      <Field label="Main image">
        <input className={textInputClass()} value={draft.image} onChange={(event) => onChange({ ...draft, image: event.target.value })} />
      </Field>
      <Field label="Images">
        <input className={textInputClass()} value={stringifyCommaSeparated(draft.images)} onChange={(event) => onChange({ ...draft, images: parseCommaSeparated(event.target.value) })} />
      </Field>
      <Field label="Rating">
        <input className={textInputClass()} type="number" min="0" max="5" step="0.1" value={draft.rating} onChange={(event) => onChange({ ...draft, rating: Number(event.target.value) })} />
      </Field>
      <Field label="Reviews">
        <input className={textInputClass()} type="number" value={draft.reviewsCount} onChange={(event) => onChange({ ...draft, reviewsCount: Number(event.target.value) })} />
      </Field>
      <div className="space-y-3 md:col-span-2">
        <ToggleField label="Visible on storefront" checked={draft.isActive !== false} onChange={(checked) => onChange({ ...draft, isActive: checked })} />
        <div className="grid gap-3 md:grid-cols-3">
          <ToggleField label="New badge" checked={Boolean(draft.isNew)} onChange={(checked) => onChange({ ...draft, isNew: checked })} />
          <ToggleField label="Hot badge" checked={Boolean(draft.isHot)} onChange={(checked) => onChange({ ...draft, isHot: checked })} />
          <ToggleField label="Sale badge" checked={Boolean(draft.isSale)} onChange={(checked) => onChange({ ...draft, isSale: checked })} />
        </div>
      </div>
      <div className="md:col-span-2">
        <Field label="Description">
          <textarea className={areaClass} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
        </Field>
      </div>
    </div>
  );
}

export function CategoryDraftForm({ draft, onChange }: { draft: Category; onChange: (draft: Category) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Name">
        <input className={textInputClass()} value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={textInputClass()} value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} />
      </Field>
      <Field label="Image">
        <input className={textInputClass()} value={draft.image ?? ''} onChange={(event) => onChange({ ...draft, image: event.target.value || undefined })} />
      </Field>
      <Field label="Icon">
        <input className={textInputClass()} value={draft.icon ?? ''} onChange={(event) => onChange({ ...draft, icon: event.target.value || undefined })} />
      </Field>
      <div className="md:col-span-2">
        <ToggleField label="Visible on storefront" checked={draft.isActive !== false} onChange={(checked) => onChange({ ...draft, isActive: checked })} />
      </div>
      <div className="md:col-span-2">
        <Field label="Description">
          <textarea className={areaClass} value={draft.description ?? ''} onChange={(event) => onChange({ ...draft, description: event.target.value || undefined })} />
        </Field>
      </div>
    </div>
  );
}

export function ServiceDraftForm({
  draft,
  categories,
  onChange,
}: {
  draft: Service;
  categories: Category[];
  onChange: (draft: Service) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Title">
        <input className={textInputClass()} value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={textInputClass()} value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} />
      </Field>
      <Field label="Link">
        <input className={textInputClass()} value={draft.link} onChange={(event) => onChange({ ...draft, link: event.target.value })} />
      </Field>
      <Field label="Icon">
        <input className={textInputClass()} value={draft.icon} onChange={(event) => onChange({ ...draft, icon: event.target.value })} />
      </Field>
      <Field label="Related category">
        <select className={textInputClass()} value={draft.relatedCategory ?? ''} onChange={(event) => onChange({ ...draft, relatedCategory: event.target.value || undefined })}>
          <option value="">No relation</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>
      <div>
        <ToggleField label="Visible on storefront" checked={draft.isActive !== false} onChange={(checked) => onChange({ ...draft, isActive: checked })} />
      </div>
      <div className="md:col-span-2">
        <Field label="Description">
          <textarea className={areaClass} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
        </Field>
      </div>
      <Field label="Features (one per line)">
        <textarea className={areaClass} value={(draft.features ?? []).join('\n')} onChange={(event) => onChange({ ...draft, features: parseLineList(event.target.value) })} />
      </Field>
      <Field label="Details (one per line)">
        <textarea className={areaClass} value={(draft.details ?? []).join('\n')} onChange={(event) => onChange({ ...draft, details: parseLineList(event.target.value) })} />
      </Field>
    </div>
  );
}

export function BlogDraftForm({ draft, onChange }: { draft: BlogPost; onChange: (draft: BlogPost) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Title">
        <input className={textInputClass()} value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={textInputClass()} value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} />
      </Field>
      <Field label="Author">
        <input className={textInputClass()} value={draft.author} onChange={(event) => onChange({ ...draft, author: event.target.value })} />
      </Field>
      <Field label="Category">
        <input className={textInputClass()} value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })} />
      </Field>
      <Field label="Image">
        <input className={textInputClass()} value={draft.image} onChange={(event) => onChange({ ...draft, image: event.target.value })} />
      </Field>
      <Field label="Published at">
        <input className={textInputClass()} type="date" value={draft.publishedAt.slice(0, 10)} onChange={(event) => onChange({ ...draft, publishedAt: event.target.value })} />
      </Field>
      <Field label="Read time">
        <input className={textInputClass()} type="number" value={draft.readTime ?? 4} onChange={(event) => onChange({ ...draft, readTime: Number(event.target.value) })} />
      </Field>
      <div className="space-y-3">
        <ToggleField label="Featured" checked={Boolean(draft.featured)} onChange={(checked) => onChange({ ...draft, featured: checked })} />
        <ToggleField label="Visible on storefront" checked={draft.isActive !== false} onChange={(checked) => onChange({ ...draft, isActive: checked })} />
      </div>
      <div className="md:col-span-2">
        <Field label="Excerpt">
          <textarea className={areaClass} value={draft.excerpt} onChange={(event) => onChange({ ...draft, excerpt: event.target.value })} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Content">
          <textarea className={`${areaClass} min-h-[220px]`} value={draft.content} onChange={(event) => onChange({ ...draft, content: event.target.value })} />
        </Field>
      </div>
    </div>
  );
}

export function makeEmptyProduct(categorySlug: string): Product {
  return {
    id: '',
    slug: '',
    title: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    category: categorySlug,
    brand: 'AL-RAYAN',
    image: '',
    images: [],
    stock: 0,
    rating: 0,
    reviewsCount: 0,
    isNew: false,
    isHot: false,
    isSale: false,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

export function makeEmptyCategory(): Category {
  return {
    id: '',
    name: '',
    slug: '',
    icon: '',
    image: '',
    parent_id: undefined,
    description: '',
    isActive: true,
  };
}

export function makeEmptyService(categorySlug: string): Service {
  return {
    id: '',
    slug: '',
    title: '',
    description: '',
    icon: 'service',
    link: '/services/',
    features: [],
    details: [],
    relatedCategory: categorySlug,
    isActive: true,
  };
}

export function makeEmptyBlogPost(): BlogPost {
  return {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    readTime: 4,
    featured: false,
    isActive: true,
  };
}
