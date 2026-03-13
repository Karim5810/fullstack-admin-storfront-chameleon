import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PasswordResetRequestSchema } from '../schema';
import { api } from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const validated = PasswordResetRequestSchema.parse({ email });
      await api.auth.requestPasswordReset(validated.email);
      setSubmitted(true);
      setCountdown(60);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'تعذر إرسال رابط التعيين.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

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
            <h1 className="text-2xl font-black text-white mb-2">إعادة تعيين كلمة المرور</h1>
            <p className="text-(--muted2)">أدخل بريدك الإلكتروني وسنرسل لك رابطا لإنشاء كلمة مرور جديدة.</p>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {!submitted ? (
            <form onSubmit={(event) => void handleSubmit(event)} className="bg-(--d2) border border-(--border) rounded-xl p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-(--chrome) mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-(--d3) border border-(--border) text-white p-3 rounded-lg focus:outline-none focus:border-(--o)"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-fire w-full mb-4 disabled:opacity-50">
                {isSubmitting ? 'جار الإرسال...' : 'إرسال رابط التعيين'}
              </button>
              <Link to="/login" className="btn-ghost w-full inline-flex justify-center">
                العودة لتسجيل الدخول
              </Link>
            </form>
          ) : (
            <div className="bg-(--d2) border border-(--border) rounded-xl p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-(--o)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="9" cy="10" r="1" />
                <circle cx="12" cy="10" r="1" />
                <circle cx="15" cy="10" r="1" />
              </svg>
              <h2 className="text-xl font-bold text-white mb-2">تم إرسال الرابط</h2>
              <p className="text-(--muted2) mb-6">
                إذا كان هذا البريد مسجلا، فسيصلك رابط إعادة التعيين على {email}.
              </p>
              {countdown > 0 ? (
                <p className="text-sm text-(--muted) mb-4">يمكنك إعادة الإرسال بعد {countdown} ثانية.</p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                }}
                disabled={countdown > 0}
                className="btn-ghost w-full disabled:opacity-50"
              >
                إعادة إرسال الرابط
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
