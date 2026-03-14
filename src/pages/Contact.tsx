import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { ContactMessage } from '../types';

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'استفسار عام',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
      phone: current.phone || user.phone || '',
    }));
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const message = await api.contact.create({
        userId: user?.id,
        ...formData,
      });
      setSubmittedMessage(message);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'تعذر إرسال الرسالة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="bg-linear-to-b from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white mb-2">اتصل بنا</h1>
          <p className="text-(--muted2)">للاستفسارات الفنية، التسعير، أو متابعة الطلبات التشغيلية.</p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: 'المقر',
              title: 'العنوان',
              value: 'المنطقة الصناعية، القاهرة، مصر',
              desc: 'نخدم مواقع العمل والمصانع في مختلف المحافظات.',
            },
            {
              icon: 'الهاتف',
              title: 'هاتف المبيعات',
              value: '+20 10 1234 5678',
              desc: 'من السبت إلى الخميس خلال ساعات العمل.',
            },
            {
              icon: 'البريد',
              title: 'البريد الإلكتروني',
              value: 'info@alrayan-industrial.com',
              desc: 'للمراسلات والطلبات الرسمية.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-(--d2) border border-(--border) rounded-xl p-6 text-center">
              <div className="text-lg font-black text-(--o) mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-(--o) font-semibold mb-1">{item.value}</p>
              <p className="text-(--muted2) text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-(--d2) border border-(--border) rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">أرسل رسالة</h2>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {!submittedMessage ? (
              <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">الاسم</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">الموضوع</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                  >
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="استفسار مبيعات">استفسار مبيعات</option>
                    <option value="دعم الطلبات">دعم الطلبات</option>
                    <option value="شراكة أو توريد">شراكة أو توريد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-fire w-full disabled:opacity-50">
                  {isSubmitting ? 'جار الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">تم استلام رسالتك</h3>
                <p className="text-(--muted2)">
                  رقم المتابعة: {submittedMessage.id}. سنراجع الرسالة ونعود إليك في أقرب وقت.
                </p>
              </div>
            )}
          </div>

          <div className="bg-(--d2) border border-(--border) rounded-xl overflow-hidden min-h-125 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">ماذا يحدث بعد الإرسال؟</h2>
            <div className="space-y-4 text-sm text-(--muted2) leading-7">
              <div className="rounded-2xl border border-(--border) bg-(--d3) p-4">
                يراجع فريقنا الرسالة ويصنفها حسب المبيعات أو الدعم أو العقود.
              </div>
              <div className="rounded-2xl border border-(--border) bg-(--d3) p-4">
                إذا كانت الرسالة مرتبطة بطلب أو عرض سعر، يتم ربطها مباشرة بملف العميل.
              </div>
              <div className="rounded-2xl border border-(--border) bg-(--d3) p-4">
                للطلبات العاجلة، يمكنك أيضا التواصل هاتفيا خلال ساعات العمل الرسمية.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
