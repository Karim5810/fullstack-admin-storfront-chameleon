import type { BlogPost, Category, Order, Product, Service } from '../types';
import { FALLBACK_IMAGE, slugify } from '../utils/catalog';
import { products as rawProducts, type Product as RawProduct } from './products';

const categoryDefinitions: Category[] = [
  {
    id: 'cat-safety',
    name: 'معدات السلامة الشخصية',
    slug: 'safety',
    description: 'خوذات ونظارات وقفازات وسترات وتجهيزات حماية للاستخدام الصناعي اليومي.',
    icon: '<path d="M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5zM7 8h10v12H7V8z" />',
  },
  {
    id: 'cat-fire',
    name: 'مكافحة الحرائق',
    slug: 'fire',
    description: 'حلول الإطفاء والإنذار والاستجابة السريعة للمكاتب والمخازن والمنشآت.',
    icon: '<path d="M9 11V6l3-3 3 3v5m-6 0h6m-8 0H5v9h14v-9h-2" />',
  },
  {
    id: 'cat-tools',
    name: 'الأدوات والعدد',
    slug: 'tools',
    description: 'أدوات تشغيل وصيانة وتجهيز مواقع العمل وخطوط الإنتاج.',
    icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />',
  },
  {
    id: 'cat-parts',
    name: 'الحلول المرورية وملحقات المواقع',
    slug: 'parts',
    description: 'عواكس ومخاريط وشريط أرضيات وحواجز مساعدة للحركة والتشغيل الآمن.',
    icon: '<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />',
  },
  {
    id: 'cat-electrical',
    name: 'السلامة الكهربائية',
    slug: 'electrical',
    description: 'قفازات عزل ولوك آوت ومستلزمات حماية وفحص لأعمال الكهرباء.',
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />',
  },
  {
    id: 'cat-measurement',
    name: 'أجهزة القياس والكشف',
    slug: 'measurement',
    description: 'أجهزة فحص ومراقبة وقياس للسلامة والعمليات الحرجة.',
    icon: '<line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />',
  },
  {
    id: 'cat-lifting',
    name: 'معدات الرفع والعمل على المرتفعات',
    slug: 'lifting',
    description: 'أحزمة وحبال حياة وملحقات حماية للفرق العاملة على الأسطح والمرتفعات.',
    icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />',
  },
];

const serviceDefinitions: Service[] = [
  {
    id: 'audit',
    slug: 'audit',
    title: 'تدقيق السلامة المهنية',
    description: 'مراجعة ميدانية شاملة للموقع مع تقرير فجوات وخطة تنفيذ بالأولوية.',
    icon: 'shield-check',
    link: '/services/audit',
    relatedCategory: 'safety',
    features: ['زيارة ميدانية', 'تقرير فجوات تفصيلي', 'خطة تصحيح عملية'],
    details: [
      'نراجع خطوط الإنتاج والمخازن ومناطق التحميل ونقاط التجمع.',
      'تسليم تقرير تنفيذي واضح للإدارة وفرق التشغيل والسلامة.',
      'الخدمة مناسبة للمصانع والمقاولين ومواقع البنية التحتية.',
    ],
  },
  {
    id: 'training',
    slug: 'training',
    title: 'تدريب السلامة والإطفاء',
    description: 'برامج تدريب عملية للاستجابة للطوارئ والإطفاء والإسعافات الأولية.',
    icon: 'graduation-cap',
    link: '/services/training',
    relatedCategory: 'fire',
    features: ['مدربون معتمدون', 'ورش تطبيقية', 'شهادات حضور'],
    details: [
      'تنفيذ التدريب داخل موقع العميل أو في قاعات مجهزة.',
      'سيناريوهات محاكاة للحريق والإخلاء والإسعافات الأولية.',
      'تصميم البرنامج حسب القطاع وعدد المتدربين ومستوى المخاطر.',
    ],
  },
  {
    id: 'maintenance',
    slug: 'maintenance',
    title: 'عقود الصيانة الوقائية',
    description: 'زيارات دورية لمعدات السلامة وأنظمة الإطفاء والكشف مع تقارير حالة.',
    icon: 'wrench',
    link: '/services/maintenance',
    relatedCategory: 'measurement',
    features: ['زيارات مجدولة', 'سجل صيانة رقمي', 'توصيات متابعة'],
    details: [
      'قياس الجاهزية التشغيلية واستبدال المكونات التالفة عند الحاجة.',
      'عقود مرنة شهرية أو ربع سنوية أو سنوية.',
      'تقارير حالة بعد كل زيارة مع أولويات واضحة.',
    ],
  },
  {
    id: 'wholesale',
    slug: 'wholesale',
    title: 'توريد بالجملة للشركات',
    description: 'عقود توريد B2B بأسعار خاصة وإدارة مخزون وتوريد دوري.',
    icon: 'truck',
    link: '/services/wholesale',
    relatedCategory: 'parts',
    features: ['تسعير تعاقدي', 'توريد شهري', 'بدائل معتمدة'],
    details: [
      'حلول للشركات التي تحتاج توريدا ثابتا أو موسميا.',
      'متابعة أرصدة وحدود إعادة الطلب للأصناف الحرجة.',
      'إمكانية ربط التوريد بأكواد العميل الداخلية.',
    ],
  },
  {
    id: 'iso',
    slug: 'iso',
    title: 'تجهيز متطلبات ISO',
    description: 'سياسات وإجراءات وسجلات تدعم الاعتماد وتحسين الانضباط التشغيلي.',
    icon: 'badge-check',
    link: '/services/iso',
    relatedCategory: 'safety',
    features: ['تحليل فجوات', 'بناء السياسات', 'تجهيز المراجعة الخارجية'],
    details: [
      'نركز على ISO 45001 و ISO 9001 ومتطلبات التشغيل المرتبطة بهما.',
      'تخصيص الوثائق بما يناسب حجم المنشأة وطبيعة النشاط.',
      'جلسات توعية للإدارة وفرق التشغيل.',
    ],
  },
  {
    id: 'risk',
    slug: 'risk',
    title: 'تقييم وكشف المخاطر',
    description: 'تحليل مخاطر الموقع ووضع مصفوفة تحكم تدعم قرارات التشغيل.',
    icon: 'search',
    link: '/services/risk',
    relatedCategory: 'measurement',
    features: ['مصفوفة مخاطر', 'توصيات تحكم', 'أولوية تنفيذ'],
    details: [
      'تحليل المخاطر التشغيلية والكهربائية والميكانيكية والبيئية.',
      'توصيات قابلة للتنفيذ مباشرة من فرق التشغيل و HSE.',
      'الخدمة مناسبة قبل التوسعات أو اعتماد خطوط إنتاج جديدة.',
    ],
  },
  {
    id: 'design',
    slug: 'design',
    title: 'تصميم أنظمة السلامة',
    description: 'تصميم حلول إرشادية وميدانية متوافقة مع واقع المنشأة ومسارات الحركة.',
    icon: 'layers',
    link: '/services/design',
    relatedCategory: 'fire',
    features: ['تصميم مبدئي', 'مخططات تنفيذ', 'مراجعة قبل التسليم'],
    details: [
      'تصميم لوحات الإرشاد ومسارات الإخلاء ونقاط السلامة.',
      'مراعاة كثافة الحركة والمخاطر الحرجة بالموقع.',
      'إمكانية دمج التصميم مع التوريد والتنفيذ.',
    ],
  },
  {
    id: 'warehouse',
    slug: 'warehouse',
    title: 'إدارة المستودعات والمخزون',
    description: 'تنظيم أصناف السلامة والمستهلكات وربطها بجداول إعادة الطلب.',
    icon: 'boxes',
    link: '/services/warehouse',
    relatedCategory: 'parts',
    features: ['تصنيف الأصناف', 'حدود إعادة الطلب', 'تقارير مخزون'],
    details: [
      'مراجعة أسلوب التخزين والوسم ومسارات الصرف وإعادة الطلب.',
      'تقليل العجز والفاقد وتوقف التشغيل بسبب النواقص.',
      'إمكانية ربط الخدمة مع عقود التوريد الدورية.',
    ],
  },
];

const blogDefinitions: BlogPost[] = [
  {
    id: 'blog-ppe-selection',
    slug: 'ppe-selection-guide',
    title: 'كيف تختار معدات الوقاية الشخصية المناسبة لبيئة العمل',
    excerpt: 'خطوات عملية لاختيار الخوذة والقفازات والنظارات وأحزمة الأمان حسب مستوى الخطر.',
    content:
      'اختيار معدات الوقاية الشخصية يبدأ من تقييم الخطر الحقيقي داخل الموقع لا من السعر فقط. يجب ربط كل مهمة بالمعدة المناسبة ومعيار المطابقة الصحيح، مع مراعاة راحة الاستخدام وتوافر المقاسات وخطة الاستبدال والفحص الدوري. كما ينبغي توثيق التدريب على الاستخدام ودمجه في إجراءات التشغيل اليومية حتى لا يتحول الالتزام إلى إجراء شكلي.',
    author: 'فريق الريان',
    category: 'safety',
    image: FALLBACK_IMAGE,
    publishedAt: '2026-02-22',
    readTime: 6,
    featured: true,
  },
  {
    id: 'blog-compliance-checklist',
    slug: 'industrial-specs-2026',
    title: 'قائمة تحقق سريعة قبل اعتماد أي مورد صناعي جديد',
    excerpt: 'ما الذي يجب مراجعته في الشهادات والمطابقة وخدمة ما بعد البيع قبل الشراء.',
    content:
      'قرارات الشراء الجيدة تعتمد على التحقق من شهادات المطابقة وسلسلة التوريد بقدر اعتمادها على السعر والمهلة. قبل اعتماد أي صنف، تأكد من وجود بيانات فنية واضحة ورقم موديل ثابت وتعليمات استخدام وخدمة ما بعد البيع أو قطع غيار متاحة. وجود قائمة تحقق موحدة بين المشتريات والسلامة والهندسة يقلل كثيرا من التوريد الخاطئ أو الازدواجية.',
    author: 'قسم الاعتمادات',
    category: 'regulations',
    image: FALLBACK_IMAGE,
    publishedAt: '2026-02-10',
    readTime: 5,
  },
  {
    id: 'blog-gas-monitoring',
    slug: 'gas-detector-selection',
    title: 'متى تحتاج منشأتك إلى أجهزة كشف غازات متخصصة',
    excerpt: 'مؤشرات واضحة تساعدك على تحديد وقت الاستثمار في أجهزة القياس المتخصصة.',
    content:
      'المنشآت التي تحتوي على عمليات مغلقة أو تهوية محدودة أو تداول للغازات تحتاج عادة إلى أجهزة قياس أكثر تخصصا من الحلول العامة. المؤشرات الأساسية تشمل تكرار الإنذارات الكاذبة وتغيرات الحمل التشغيلي وتعدد مصادر الخطر. اختيار الجهاز يجب أن يعتمد على نوع الغاز ونطاق القياس وسرعة الاستجابة وإمكانية المعايرة والصيانة الدورية.',
    author: 'وحدة الحلول الفنية',
    category: 'equipment',
    image: FALLBACK_IMAGE,
    publishedAt: '2026-01-28',
    readTime: 4,
  },
  {
    id: 'blog-warehouse-safety',
    slug: 'warehouse-safety-playbook',
    title: 'ثماني ممارسات تقلل الحوادث داخل المخازن ومناطق المناولة',
    excerpt: 'من مسارات الحركة إلى تخزين المواد ووضع العواكس، هذه الممارسات تخفض الإصابات والخسائر.',
    content:
      'تبدأ سلامة المخازن من وضوح المسارات والفصل بين حركة الأفراد والمعدات، ثم تمتد إلى أسلوب تخزين منظم وتحديد أحمال الرفوف وإدارة نقاط الاختناق. كثير من الحوادث ينتج عن تفاصيل بسيطة مثل ضعف الإضاءة أو سوء تموضع العواكس أو استخدام حواجز غير مناسبة. وجود خطة تشغيل يومية ومراجعات بصرية سريعة يرفع الجاهزية ويخفض الخسائر بشكل مباشر.',
    author: 'فريق العمليات',
    category: 'tips',
    image: FALLBACK_IMAGE,
    publishedAt: '2026-01-16',
    readTime: 7,
  },
];

const parsePrice = (value?: string) => {
  const numericValue = value?.match(/[\d.]+/g)?.join('') ?? '0';
  return Number.parseFloat(numericValue) || 0;
};

const buildSeedProduct = (product: RawProduct, index: number): Product => {
  const price = parsePrice(product.price);
  const oldPrice = parsePrice(product.discount);
  const createdAt = new Date(Date.now() - index * 86400000).toISOString();

  return {
    id: product.id,
    slug: slugify(`${product.title}-${product.id}`),
    title: product.title,
    description: product.description,
    price,
    oldPrice: oldPrice > price ? oldPrice : undefined,
    category: product.category,
    brand: product.brand,
    image: product.image || FALLBACK_IMAGE,
    images: [product.image || FALLBACK_IMAGE],
    stock: 6 + ((index * 5) % 26),
    rating: Number((4 + ((index % 7) * 0.11)).toFixed(1)),
    reviewsCount: 18 + index * 7,
    isNew: index < 6,
    isHot: index % 5 === 0,
    isSale: oldPrice > price,
    createdAt,
  };
};

export const seedProducts: Product[] = rawProducts.map(buildSeedProduct);

export const categoryProductCounts = seedProducts.reduce<Record<string, number>>((acc, product) => {
  acc[product.category] = (acc[product.category] ?? 0) + 1;
  return acc;
}, {});

export const seedCategories: Category[] = categoryDefinitions.map((category) => ({
  ...category,
  image: FALLBACK_IMAGE,
}));

export const seedBlogPosts = blogDefinitions;

export const seedServices = serviceDefinitions;

export const seedOrders: Order[] = [
  {
    id: 'ord-demo-001',
    orderNumber: 'ORD-2026-0001',
    userId: 'demo-user',
    status: 'delivered',
    subtotal: seedProducts[0].price + seedProducts[4].price,
    shippingFee: 50,
    total: seedProducts[0].price + seedProducts[4].price + 50,
    paymentMethod: 'cash',
    createdAt: '2026-02-18T10:00:00.000Z',
    items: [
      { productId: seedProducts[0].id, quantity: 1, price: seedProducts[0].price },
      { productId: seedProducts[4].id, quantity: 1, price: seedProducts[4].price },
    ],
    shippingAddress: {
      fullName: 'محمد أحمد',
      phone: '+20 100 123 4567',
      street: 'المنطقة الصناعية الثانية',
      city: 'القاهرة',
      state: 'القاهرة',
      zipCode: '11728',
      country: 'Egypt',
    },
  },
  {
    id: 'ord-demo-002',
    orderNumber: 'ORD-2026-0002',
    userId: 'demo-user',
    status: 'shipped',
    subtotal: seedProducts[9].price,
    shippingFee: 50,
    total: seedProducts[9].price + 50,
    paymentMethod: 'bank',
    createdAt: '2026-03-01T13:30:00.000Z',
    items: [{ productId: seedProducts[9].id, quantity: 1, price: seedProducts[9].price }],
    shippingAddress: {
      fullName: 'محمد أحمد',
      phone: '+20 100 123 4567',
      street: 'مدينة العاشر من رمضان',
      city: 'الشرقية',
      state: 'الشرقية',
      zipCode: '44629',
      country: 'Egypt',
    },
  },
];

export const cloneProduct = (product: Product): Product => ({
  ...product,
  images: [...product.images],
});

export const cloneCategory = (category: Category): Category => ({ ...category });

export const cloneBlogPost = (post: BlogPost): BlogPost => ({ ...post });

export const cloneService = (service: Service): Service => ({
  ...service,
  features: [...(service.features ?? [])],
  details: [...(service.details ?? [])],
});

export const cloneOrder = (order: Order): Order => ({
  ...order,
  items: order.items.map((item) => ({ ...item })),
  shippingAddress: { ...order.shippingAddress },
});
