import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AddressSchema } from '../schema';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useCommerce } from '../contexts/CommerceContext';
import type { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/catalog';

const paymentOptions: Array<{ id: PaymentMethod; label: string; hint: string }> = [
  { id: 'cash', label: 'الدفع عند الاستلام', hint: 'مناسب للطلبات المحلية السريعة.' },
  { id: 'vodafone', label: 'فودافون كاش', hint: 'سيصلك رقم المحفظة بعد تأكيد الطلب.' },
  { id: 'instapay', label: 'InstaPay', hint: 'تحويل فوري مع مشاركة مرجع الطلب.' },
  { id: 'bank', label: 'تحويل بنكي', hint: 'نرسل بيانات الحساب البنكي بعد إنشاء الطلب.' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartSubtotal, shippingFee, cartTotal, clearCart } = useCommerce();
  const [step, setStep] = useState(1);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Egypt',
    paymentMethod: 'cash' as PaymentMethod,
  });

  useEffect(() => {
    const loadDefaultAddress = async () => {
      if (!user?.id) {
        setIsLoadingAddress(false);
        return;
      }

      setIsLoadingAddress(true);
      setError(null);

      try {
        const address = await api.addresses.getDefault(user.id);
        setFormData((current) => ({
          ...current,
          fullName: address?.fullName ?? user.name,
          phone: address?.phone ?? user.phone ?? '',
          street: address?.street ?? '',
          city: address?.city ?? '',
          state: address?.state ?? '',
          zipCode: address?.zipCode ?? '',
          country: address?.country ?? 'Egypt',
        }));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'تعذر تحميل عنوان الشحن.');
      } finally {
        setIsLoadingAddress(false);
      }
    };

    void loadDefaultAddress();
  }, [user?.id, user?.name, user?.phone]);

  const shippingAddress = useMemo(
    () => ({
      fullName: formData.fullName,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      isDefault: true,
    }),
    [formData],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleNextStep = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (step === 1) {
      try {
        AddressSchema.parse(shippingAddress);
        setStep(2);
      } catch (validationError) {
        setError(validationError instanceof Error ? validationError.message : 'تحقق من بيانات الشحن.');
      }
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (!user?.id) {
      setError('يجب تسجيل الدخول قبل إنشاء الطلب.');
      return;
    }

    if (cartItems.length === 0) {
      setError('سلة المشتريات فارغة.');
      return;
    }

    setIsSubmitting(true);

    try {
      const savedAddress = await api.addresses.upsertDefault(user.id, shippingAddress);
      const order = await api.orders.create({
        userId: user.id,
        status: 'pending',
        subtotal: cartSubtotal,
        shippingFee,
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          product: item.product,
        })),
        shippingAddress: savedAddress,
      });

      await clearCart();
      navigate(`/checkout/success?order=${encodeURIComponent(order.orderNumber)}&id=${encodeURIComponent(order.id)}`, {
        replace: true,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إنشاء الطلب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isLoadingAddress) {
    return (
      <div className="page-enter">
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-black text-white mb-4">لا يوجد ما يمكن إتمام شرائه</h1>
          <p className="text-(--muted2) mb-6">أضف منتجات إلى السلة أولا ثم عد لإتمام الطلب.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/cart" className="btn-ghost">
              العودة إلى السلة
            </Link>
            <Link to="/products" className="btn-fire">
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="bg-(--d2) border-b border-(--border) py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-(--o)">
              الرئيسية
            </Link>
            <span className="mx-2 text-(--muted)">/</span>
            <span className="text-(--chrome)">إتمام الشراء</span>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex justify-between mb-12 gap-4">
          {[1, 2, 3].map((value) => (
            <div key={value} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= value ? 'bg-(--o) text-white' : 'bg-(--d2) text-(--muted2)'
                }`}
              >
                {value}
              </div>
              {value < 3 ? (
                <div className={`flex-1 h-1 mx-2 ${step > value ? 'bg-(--o)' : 'bg-(--border)'}`} />
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={(event) => void handleNextStep(event)} className="bg-(--d2) border border-(--border) rounded-xl p-8">
              {error ? (
                <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              {step === 1 ? (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">عنوان الشحن</h2>
                  {isLoadingAddress ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-12 rounded-xl bg-(--d3) animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-(--chrome) mb-2">الاسم الكامل</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                          required
                        />
                      </div>
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
                        <label className="block text-sm font-semibold text-(--chrome) mb-2">الشارع والعنوان التفصيلي</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-(--chrome) mb-2">المدينة</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-(--chrome) mb-2">المحافظة</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-(--chrome) mb-2">الرمز البريدي</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-(--chrome) mb-2">الدولة</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">طريقة الدفع</h2>
                  <div className="space-y-3">
                    {paymentOptions.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-(--o) bg-[rgba(255,107,0,0.08)]'
                            : 'border-(--border) hover:bg-(--d3)'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-white font-semibold">{method.label}</span>
                          <span className="block text-sm text-(--muted2) mt-1">{method.hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">مراجعة الطلب</h2>
                  <div className="space-y-4">
                    <div className="bg-(--d3) rounded-lg p-4">
                      <p className="text-sm text-(--muted2) mb-1">العنوان</p>
                      <p className="text-white font-semibold">
                        {shippingAddress.fullName}
                        <br />
                        {shippingAddress.street}
                        <br />
                        {shippingAddress.city}، {shippingAddress.state}
                        <br />
                        {shippingAddress.phone}
                      </p>
                    </div>

                    <div className="bg-(--d3) rounded-lg p-4">
                      <p className="text-sm text-(--muted2) mb-1">طريقة الدفع</p>
                      <p className="text-white font-semibold">
                        {paymentOptions.find((entry) => entry.id === formData.paymentMethod)?.label}
                      </p>
                    </div>

                    <div className="bg-(--d3) rounded-lg p-4">
                      <p className="text-sm text-(--muted2) mb-3">المنتجات</p>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between gap-4 text-sm">
                            <span className="text-white">
                              {item.product.title} × {item.quantity}
                            </span>
                            <span className="text-(--chrome)">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                  disabled={step === 1 || isSubmitting}
                  className="btn-ghost flex-1 disabled:opacity-50"
                >
                  السابق
                </button>
                <button type="submit" disabled={isSubmitting || isLoadingAddress} className="btn-fire flex-1 disabled:opacity-50">
                  {step === 3 ? (isSubmitting ? 'جار إنشاء الطلب...' : 'تأكيد الطلب') : 'التالي'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-(--d2) border border-(--border) rounded-xl p-6 sticky top-[200px]">
              <h3 className="text-lg font-bold text-white mb-4">ملخص الطلب</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-(--border)">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-(--muted2)">
                      {item.product.title} × {item.quantity}
                    </span>
                    <span className="text-(--chrome)">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-(--border) text-sm">
                <div className="flex justify-between">
                  <span className="text-(--muted2)">المجموع الفرعي</span>
                  <span className="text-(--chrome)">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted2)">الشحن</span>
                  <span className="text-(--chrome)">{formatCurrency(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-bold text-(--chrome)">الإجمالي</span>
                <span className="text-2xl font-black text-(--o)">{formatCurrency(cartTotal)}</span>
              </div>

              <Link to="/cart" className="btn-ghost w-full inline-flex justify-center text-center">
                تعديل السلة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
