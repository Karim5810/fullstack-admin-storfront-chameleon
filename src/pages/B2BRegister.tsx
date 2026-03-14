import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { B2BRegistrationSchema } from '../schema';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';

const initialForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  sector: '',
  expectedMonthlySpend: '',
  requirements: '',
};

export default function B2BRegister() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ...initialForm,
    email: user?.email ?? '',
    contactName: user?.name ?? '',
    phone: user?.phone ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const validated = B2BRegistrationSchema.parse(formData);
      const result = await api.b2b.register({
        ...validated,
        userId: user?.id,
      });
      setSubmittedId(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال طلب التسجيل حالياً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) via-(--d2) to-(--d3) border-b border-(--border) py-14">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl font-black mb-4">تسجيل حساب أعمال</h1>
          <p className="text-(--muted2) leading-8">
            افتح ملف شركتك مع فريق التوريد B2B للحصول على تسعير تعاقدي ومتابعة احتياجات المواقع والمخازن.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {submittedId ? (
          <div className="max-w-2xl mx-auto rounded-3xl border border-(--border) bg-(--d2) p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">تم استلام طلب التسجيل</h2>
            <p className="text-(--o) font-bold mb-4">رقم الطلب: {submittedId}</p>
            <p className="text-(--muted2) leading-8 mb-6">
              سيقوم فريق المبيعات بمراجعة بيانات الشركة والتواصل خلال يوم عمل واحد لتفعيل الملف التجاري.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/b2b" className="btn-fire">
                العودة إلى حلول B2B
              </Link>
              <Link to="/quote" className="btn-ghost">
                طلب عرض سعر مباشر
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-(--border) bg-(--d2) p-8 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">اسم الشركة</label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">اسم المسؤول</label>
                  <input
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">رقم الهاتف</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">القطاع</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                    required
                  >
                    <option value="">اختر القطاع</option>
                    <option value="manufacturing">تصنيع</option>
                    <option value="construction">إنشاءات</option>
                    <option value="facilities">إدارة مرافق</option>
                    <option value="logistics">لوجستيات ومخازن</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">الإنفاق الشهري المتوقع</label>
                  <select
                    name="expectedMonthlySpend"
                    value={formData.expectedMonthlySpend}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                    required
                  >
                    <option value="">اختر النطاق</option>
                    <option value="under-25k">أقل من 25 ألف ج.م</option>
                    <option value="25k-100k">من 25 إلى 100 ألف ج.م</option>
                    <option value="100k-plus">أكثر من 100 ألف ج.م</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-(--chrome) mb-2">الاحتياجات التشغيلية</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-(--d3) border border-(--border) rounded-lg p-3 text-white"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-fire w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب التسجيل'}
              </button>
            </form>

            <aside className="rounded-3xl border border-(--border) bg-(--d2) p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">ماذا يحدث بعد التسجيل؟</h2>
              {[
                'مراجعة بيانات الشركة والمجال التشغيلي.',
                'تحديد مسؤول الحساب وخطة التوريد الأنسب.',
                'تفعيل التسعير التجاري وقنوات الطلب المباشر.',
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm text-(--muted2)">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-(--o) shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
