import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await signIn(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الدخول حالياً.');
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-(--d2) p-8 rounded-2xl border border-(--border) shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-(--muted2)">ادخل إلى حسابك لمتابعة الطلبات وإدارة بياناتك.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-(--chrome)">كلمة المرور</label>
              <Link to="/forgot-password" className="text-xs text-(--o) hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-(--muted2)">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-(--o) font-bold hover:underline">
            سجل الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
