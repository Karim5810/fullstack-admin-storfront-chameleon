import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-gradient-to-b from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container">
          <h1 className="text-4xl font-black text-white">سياسة الخصوصية</h1>
          <p className="text-(--muted2) mt-2">آخر تحديث: يناير 2024</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl">
          <div className="prose prose-invert space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. المقدمة</h2>
              <p className="text-(--muted2) leading-relaxed">
                نحن في الريان للسلامة الصناعية نلتزم بحماية خصوصيتك. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي بيانات شخصية.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. البيانات التي نجمعها</h2>
              <ul className="list-disc list-inside space-y-2 text-(--muted2)">
                <li>المعلومات الشخصية (الاسم، البريد الإلكتروني، الهاتف)</li>
                <li>عنوان الشحن والدفع</li>
                <li>سجل الطلبات والتصفح</li>
                <li>بيانات الجهاز ومعلومات المتصفح</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. استخدام البيانات</h2>
              <ul className="list-disc list-inside space-y-2 text-(--muted2)">
                <li>معالجة طلباتك وتسليم منتجاتك</li>
                <li>توصيل التحديثات والعروض الخاصة</li>
                <li>تحسين خدماتنا وموقعنا</li>
                <li>الامتثال للالتزامات القانونية</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. حماية البيانات</h2>
              <p className="text-(--muted2) leading-relaxed">
                نستخدم تقنيات التشفير والأمان الحديثة لحماية بيانات شخصية من الوصول غير المصرح به والفقدان والتعديل.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. حقوقك</h2>
              <p className="text-(--muted2) leading-relaxed">
                لديك الحق في الوصول وتصحيح وحذف بيانات شخصية. للقيام بذلك، يرجى التواصل معنا عبر البريد الإلكتروني.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. التواصل معنا</h2>
              <p className="text-(--muted2) leading-relaxed">
                إذا كان لديك أي أسئلة حول هذه السياسة، يرجى التواصل معنا على:
              </p>
              <p className="text-(--o) mt-2">
                البريد الإلكتروني: privacy@alrayan.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
