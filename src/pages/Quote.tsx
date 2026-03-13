import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { QuoteRequest } from '../types';

export default function Quote() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    phone: '',
    email: '',
    activity: '',
    orderSize: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((current) => ({
      ...current,
      contactName: current.contactName || user.name,
      email: current.email || user.email,
      phone: current.phone || user.phone || '',
      company: current.company || user.company || '',
    }));
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const quote = await api.quote.create({
        userId: user?.id,
        ...formData,
      });
      setSubmittedQuote(quote);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'تعذر إرسال طلب العرض.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white">طلب عرض سعر</h1>
          <p className="text-(--muted2) mt-2">أرسل لنا المواصفات والكميات المطلوبة وسنعود إليك بعرض مخصص.</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {error ? (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {!submittedQuote ? (
            <div className="bg-(--d2) border border-(--border) rounded-xl p-8">
              <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-(--chrome) mb-2">اسم الشركة</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-(--chrome) mb-2">اسم المسؤول</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-(--chrome) mb-2">رقم الهاتف</label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-(--chrome) mb-2">نشاط الشركة</label>
                    <select
                      name="activity"
                      value={formData.activity}
                      onChange={handleChange}
                      className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                      required
                    >
                      <option value="">اختر</option>
                      <option value="تصنيع">تصنيع</option>
                      <option value="إنشاءات">إنشاءات</option>
                      <option value="مخازن ولوجستيات">مخازن ولوجستيات</option>
                      <option value="صيانة وتشغيل">صيانة وتشغيل</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-(--chrome) mb-2">حجم الطلب المتوقع</label>
                    <select
                      name="orderSize"
                      value={formData.orderSize}
                      onChange={handleChange}
                      className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                      required
                    >
                      <option value="">اختر</option>
                      <option value="طلب أولي">طلب أولي</option>
                      <option value="توريد شهري">توريد شهري</option>
                      <option value="مناقصة أو مشروع">مناقصة أو مشروع</option>
                      <option value="عقد سنوي">عقد سنوي</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--chrome) mb-2">وصف المنتجات أو الخدمة المطلوبة</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                    required
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-fire w-full disabled:opacity-50">
                  {isSubmitting ? 'جار إرسال الطلب...' : 'إرسال طلب العرض'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-(--d2) border border-(--border) rounded-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(0,200,120,0.1)] border border-[rgba(0,200,120,0.3)] mb-6">
                <svg className="w-10 h-10 text-[#00c878]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">تم استلام طلب العرض</h2>
              <p className="text-(--o) font-bold text-lg mb-4">رقم المرجع: {submittedQuote.id}</p>
              <p className="text-(--muted2) mb-8">سيتواصل معك فريق المبيعات خلال أقرب وقت لتجهيز التسعير والمواصفات.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/" className="btn-fire">
                  العودة للرئيسية
                </Link>
                <Link to="/contact" className="btn-ghost">
                  تواصل مباشر
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
