import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordUpdateSchema } from '../schema';
import { api } from '../api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    const value = formData.newPassword;
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 1;
    if (/\d/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    return strength;
  }, [formData.newPassword]);

  const strengthMeta = useMemo(() => {
    switch (passwordStrength) {
      case 0:
        return { text: 'ضعيفة جدا', color: 'bg-red-500' };
      case 1:
        return { text: 'ضعيفة', color: 'bg-orange-500' };
      case 2:
        return { text: 'متوسطة', color: 'bg-yellow-500' };
      case 3:
        return { text: 'قوية', color: 'bg-emerald-500' };
      default:
        return { text: 'قوية جدا', color: 'bg-green-600' };
    }
  }, [passwordStrength]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const validated = PasswordUpdateSchema.parse(formData);
      await api.auth.updatePassword(validated.newPassword);
      setSubmitted(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'تعذر تحديث كلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="container min-h-[70vh] flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(255,107,0,0.1)] border border-(--border) mb-4">
              <svg className="w-8 h-8 fill-(--o)" viewBox="0 0 24 24">
                <path d="M12 1L9 4M15 4L12 1M9 4C4.6 4 1 7.6 1 12V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V12C23 7.6 19.4 4 15 4M12 7V12.41L14.71 15.12M12 12.41V18" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">تعيين كلمة مرور جديدة</h1>
            <p className="text-(--muted2)">اختر كلمة مرور قوية لحسابك ثم سجّل الدخول من جديد.</p>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {!submitted ? (
            <form onSubmit={(event) => void handleSubmit(event)} className="bg-(--d2) border border-(--border) rounded-xl p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-(--chrome) mb-2">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg pr-12 focus:outline-none focus:border-(--o)"
                    placeholder="كلمة مرور قوية"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted2) hover:text-(--o)"
                  >
                    {showPassword ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>

                {formData.newPassword ? (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className={`flex-1 h-2 rounded-full transition-colors ${
                            index < passwordStrength ? strengthMeta.color : 'bg-(--d3)'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-(--muted2)">قوة كلمة المرور: {strengthMeta.text}</p>
                  </div>
                ) : null}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-(--chrome) mb-2">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-fire w-full disabled:opacity-50">
                {isSubmitting ? 'جار الحفظ...' : 'حفظ كلمة المرور'}
              </button>
            </form>
          ) : (
            <div className="bg-(--d2) border border-(--border) rounded-xl p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <h2 className="text-xl font-bold text-white mb-2">تم تحديث كلمة المرور</h2>
              <p className="text-(--muted2)">سيتم تحويلك إلى صفحة تسجيل الدخول خلال لحظات.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-(--o) hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
