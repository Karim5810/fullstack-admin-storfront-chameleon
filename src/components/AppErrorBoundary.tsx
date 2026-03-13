import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  declare props: Readonly<AppErrorBoundaryProps>;

  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-20 min-h-[60vh] flex items-center justify-center">
          <div className="max-w-xl w-full rounded-3xl border border-(--border) bg-(--d2) p-10 text-center">
            <h1 className="text-3xl font-black text-white mb-4">حدث خطأ غير متوقع</h1>
            <p className="text-(--muted2) mb-6">
              تعذر تحميل الصفحة الحالية. يمكنك العودة إلى الرئيسية أو إعادة المحاولة.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="btn-fire" onClick={() => window.location.reload()}>
                إعادة المحاولة
              </button>
              <Link to="/" className="btn-ghost">
                العودة إلى الرئيسية
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
