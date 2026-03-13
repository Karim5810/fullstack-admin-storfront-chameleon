import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, signOut, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setPhone(user.phone ?? '');
    setCompany(user.company ?? '');
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSave = async () => {
    setError(null);
    setStatusMessage(null);

    try {
      await updateProfile({ name, phone, company });
      setStatusMessage('تم حفظ بيانات الحساب بنجاح.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'تعذر حفظ البيانات حاليا.');
    }
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl rounded-2xl border border-(--border) bg-(--d2) p-10 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">حسابي</h1>
          <p className="mb-6 text-(--muted2)">
            يجب تسجيل الدخول أولا للوصول إلى بيانات الحساب والطلبات والمفضلة.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/login" className="btn-fire">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="btn-ghost">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="h-fit w-full rounded-2xl border border-(--border) bg-(--d2) p-6 md:w-1/4">
          <div className="mb-8 flex items-center gap-4 border-b border-(--border) pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--o) text-2xl font-bold text-white">
              {user?.name?.charAt(0) ?? 'ر'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.name ?? 'مستخدم الريان'}</h2>
              <p className="text-sm text-(--muted2)">{user?.email ?? 'name@example.com'}</p>
              {user?.role === 'admin' ? (
                <span className="mt-2 inline-flex rounded-full border border-[rgba(255,107,0,0.25)] bg-[rgba(255,107,0,0.1)] px-2 py-1 text-xs font-bold text-(--o)">
                  Admin
                </span>
              ) : null}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              to="/account"
              className="flex items-center gap-3 rounded-lg bg-(--o) px-4 py-3 font-semibold text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              المعلومات الشخصية
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-(--chrome) transition-colors hover:bg-(--d3)"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              طلباتي
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-(--chrome) transition-colors hover:bg-(--d3)"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              المفضلة
            </Link>
            {user?.role === 'admin' ? (
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-(--chrome) transition-colors hover:bg-(--d3)"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 13h8V3H3z" />
                  <path d="M13 21h8v-6h-8z" />
                  <path d="M13 3h8v8h-8z" />
                  <path d="M3 21h8v-6H3z" />
                </svg>
                لوحة الإدارة
              </Link>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right text-red-400 transition-colors hover:bg-red-500/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              تسجيل الخروج
            </button>
          </nav>
        </aside>

        <main className="flex-1 rounded-2xl border border-(--border) bg-(--d2) p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-white">المعلومات الشخصية</h1>
            {user?.role === 'admin' ? (
              <Link to="/admin" className="btn-ghost">
                فتح لوحة الإدارة
              </Link>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-(--chrome)">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-lg border border-(--border) bg-(--d3) px-4 py-3 text-white outline-none transition-colors focus:border-(--o)"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-(--chrome)">البريد الإلكتروني</label>
              <input
                type="email"
                value={user?.email ?? ''}
                className="rounded-lg border border-(--border) bg-(--d3) px-4 py-3 text-white opacity-80 outline-none"
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-(--chrome)">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+20 10 1234 5678"
                className="rounded-lg border border-(--border) bg-(--d3) px-4 py-3 text-white outline-none transition-colors focus:border-(--o)"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-(--chrome)">الشركة</label>
              <input
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="اسم الشركة"
                className="rounded-lg border border-(--border) bg-(--d3) px-4 py-3 text-white outline-none transition-colors focus:border-(--o)"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-(--border) pt-8">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="btn-fire px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'جار الحفظ...' : 'حفظ التغييرات'}
            </button>
            {statusMessage ? <p className="text-sm text-green-400">{statusMessage}</p> : null}
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
