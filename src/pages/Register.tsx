import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoading, isAuthenticated } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  let passwordStrength = 0;
  if (password.length >= 8) passwordStrength += 1;
  if (/[A-Z]/.test(password)) passwordStrength += 1;
  if (/[0-9]/.test(password)) passwordStrength += 1;
  if (/[^A-Za-z0-9]/.test(password)) passwordStrength += 1;

  const strengthLabel =
    passwordStrength <= 1 ? 'ضعيفة' : passwordStrength <= 3 ? 'متوسطة' : 'قوية';

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    try {
      await signUp(email.trim(), password, name.trim());
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إنشاء الحساب حالياً.');
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-(--d2) p-8 rounded-2xl border border-(--border) shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
          <p className="text-(--muted2)">أنشئ حسابك لبدء التسوق وطلب عروض الأسعار ومتابعة الخدمات.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-(--chrome)">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="bg-(--d3) border border-(--border) text-white px-4 py-3 rounded-lg outline-none focus:border-(--o) transition-colors"
              placeholder="محمد أحمد"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-(--chrome)">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-(--d3) border border-(--border) text-white px-4 py-3 rounded-lg outline-none focus:border-(--o) transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-(--chrome)">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="bg-(--d3) border border-(--border) text-white px-4 py-3 rounded-lg outline-none focus:border-(--o) transition-colors"
              placeholder="••••••••"
              required
            />
            <div className="flex items-center gap-3 text-xs text-(--muted2)">
              <div className="flex-1 h-2 rounded-full bg-(--d3) overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength <= 1
                      ? 'bg-red-500'
                      : passwordStrength <= 3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.max(passwordStrength, 1) * 25}%` }}
                />
              </div>
              <span>{strengthLabel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-(--chrome)">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="bg-(--d3) border border-(--border) text-white px-4 py-3 rounded-lg outline-none focus:border-(--o) transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-fire w-full justify-center mt-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-(--muted2)">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-(--o) font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
