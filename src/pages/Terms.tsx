import React from 'react';

export default function Terms() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-gradient-to-b from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container">
          <h1 className="text-4xl font-black text-white">الشروط والأحكام</h1>
          <p className="text-(--muted2) mt-2">آخر تحديث: يناير 2024</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl">
          <div className="prose prose-invert space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. الشروط العامة</h2>
              <p className="text-(--muted2) leading-relaxed">
                باستخدام موقعنا، أنت توافق على هذه الشروط والأحكام بالكامل. إذا لم توافق على أي جزء منها، يرجى عدم استخدام موقعنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. ملكية المحتوى</h2>
              <p className="text-(--muted2) leading-relaxed">
                جميع المحتوى على موقعنا، بما في ذلك النصوص والصور والشعارات، مملوكة لنا أو لشركائنا. لا يمكنك استخدام هذا المحتوى دون إذن كتابي منا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. استخدام الخدمة</h2>
              <ul className="list-disc list-inside space-y-2 text-(--muted2)">
                <li>تلتزم بعدم استخدام الموقع لأي أغراض غير قانونية أو غير أخلاقية</li>
                <li>تلتزم بعدم نشر محتوى مسيء أو مزعج</li>
                <li>تلتزم بعدم محاولة اختراق نظام الموقع</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. سياسة الإرجاع</h2>
              <p className="text-(--muted2) leading-relaxed">
                يمكنك إرجاع المنتجات خلال 14 يوماً من الشراء إذا كانت في حالة أصلية. راجع صفحة سياسة الإرجاع لمزيد من التفاصيل.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. حدود المسؤولية</h2>
              <p className="text-(--muted2) leading-relaxed">
                لن نكون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة ناشئة عن استخدام موقعنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. التعديلات</h2>
              <p className="text-(--muted2) leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. التواصل</h2>
              <p className="text-(--muted2) leading-relaxed">
                إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر البريد الإلكتروني.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
