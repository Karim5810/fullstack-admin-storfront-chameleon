import React from 'react';

export default function Returns() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-gradient-to-b from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container">
          <h1 className="text-4xl font-black text-white">سياسة الإرجاع والاسترجاع</h1>
          <p className="text-(--muted2) mt-2">آخر تحديث: يناير 2024</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl">
          <div className="prose prose-invert space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. فترة الإرجاع</h2>
              <p className="text-(--muted2) leading-relaxed">
                يمكنك إرجاع المنتجات خلال 14 يوماً من استقبالك للطلب. المنتجات يجب أن تكون في حالتها الأصلية ولم تستخدم.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. شروط الإرجاع</h2>
              <ul className="list-disc list-inside space-y-2 text-(--muted2)">
                <li>المنتج في حالته الأصلية دون استخدام</li>
                <li>الملصقات والأختام سليمة</li>
                <li>الحزمة الأصلية موجودة وسليمة</li>
                <li>جميع الملحقات والفواتير موجودة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. عملية الإرجاع</h2>
              <p className="text-(--muted2) leading-relaxed mb-4">
                لإرجاع منتج، يرجى:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-(--muted2)">
                <li>تواصل معنا عبر البريد الإلكتروني أو الهاتف</li>
                <li>احصل على رقم ترخيص الإرجاع</li>
                <li>أرسل المنتج بالعنوان المزود</li>
                <li>انتظر تأكيد الاستقبال والمعالجة</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. استرجاع الأموال</h2>
              <p className="text-(--muted2) leading-relaxed">
                بعد استقبالنا للمنتج والتحقق من حالته، سيتم استرجاع أموالك خلال 5 أيام عمل.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. منتجات غير قابلة للإرجاع</h2>
              <ul className="list-disc list-inside space-y-2 text-(--muted2)">
                <li>المنتجات المستخدمة أو التالفة</li>
                <li>المنتجات بدون حزمة أصلية</li>
                <li>المنتجات المخصصة أو المطبوعة</li>
                <li>المنتجات منتهية الصلاحية</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. التواصل</h2>
              <p className="text-(--muted2) leading-relaxed">
                للاستفسار عن الإرجاع، يرجى التواصل معنا:
              </p>
              <p className="text-(--o) mt-2">
                البريد: returns@alrayan.com<br />
                الهاتف: +20 100 123 4567
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
