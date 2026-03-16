import type { Product, Category, Service, BlogPost } from '../../types';
import {
  ProductDraftForm,
  CategoryDraftForm,
  ServiceDraftForm,
  BlogDraftForm,
} from './CatalogForms';

type CatalogEditorProps =
  | {
      type: 'product';
      draft: Product;
      categories: Category[];
      onChange: (draft: Product) => void;
    }
  | {
      type: 'category';
      draft: Category;
      categories: Category[];
      onChange: (draft: Category) => void;
    }
  | {
      type: 'service';
      draft: Service;
      categories: Category[];
      onChange: (draft: Service) => void;
    }
  | {
      type: 'post';
      draft: BlogPost;
      categories: Category[];
      onChange: (draft: BlogPost) => void;
    };

export function CatalogEditor(props: CatalogEditorProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 md:p-6">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">
          {props.type === 'product'
            ? 'تعديل المنتج'
            : props.type === 'category'
              ? 'تعديل القسم'
              : props.type === 'service'
                ? 'تعديل الخدمة'
                : 'تعديل المقالة'}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {props.type === 'product'
            ? 'اسم: ' + (props.draft.title || '—')
            : props.type === 'category'
              ? 'اسم: ' + (props.draft.name || '—')
              : props.type === 'service'
                ? 'عنوان: ' + (props.draft.title || '—')
                : 'عنوان: ' + (props.draft.title || '—')}
        </p>
      </div>

      {/* Scrollable form container for better mobile experience */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        {props.type === 'product' && (
          <ProductDraftForm
            draft={props.draft}
            categories={props.categories}
            onChange={props.onChange}
          />
        )}
        {props.type === 'category' && (
          <CategoryDraftForm
            draft={props.draft}
            onChange={props.onChange}
          />
        )}
        {props.type === 'service' && (
          <ServiceDraftForm
            draft={props.draft}
            categories={props.categories}
            onChange={props.onChange}
          />
        )}
        {props.type === 'post' && (
          <BlogDraftForm
            draft={props.draft}
            onChange={props.onChange}
          />
        )}
      </div>
    </div>
  );
}
