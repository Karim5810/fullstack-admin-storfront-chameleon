import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CommerceProvider } from './contexts/CommerceContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { RequireAdmin, RequireAuth } from './components/RouteGuards';
import Topbar from './components/Topbar';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import SearchResults from './pages/SearchResults';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Blog from './pages/Blog';
import Services from './pages/Services';
import Deals from './pages/Deals';
import Quote from './pages/Quote';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import B2B from './pages/B2B';
import B2BRegister from './pages/B2BRegister';
import Returns from './pages/Returns';
import Careers from './pages/Careers';
import Partners from './pages/Partners';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetail from './pages/CategoryDetail';
import BlogPostPage from './pages/BlogPostPage';
import ServiceDetail from './pages/ServiceDetail';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import News from './pages/News';
import Certificates from './pages/Certificates';
import Corporate from './pages/Corporate';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:slug" element={<CategoryDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/training" element={<Navigate to="/services/training" replace />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPostPage />} />
      <Route path="/news" element={<News />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="/b2b" element={<B2B />} />
      <Route path="/b2b/register" element={<B2BRegister />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/corporate" element={<Corporate />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <Account />
          </RequireAuth>
        }
      />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />
      <Route
        path="/checkout/success"
        element={
          <RequireAuth>
            <CheckoutSuccess />
          </RequireAuth>
        }
      />
      <Route
        path="/wishlist"
        element={
          <RequireAuth>
            <Wishlist />
          </RequireAuth>
        }
      />
      <Route
        path="/orders"
        element={
          <RequireAuth>
            <Orders />
          </RequireAuth>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <RequireAuth>
            <OrderDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />

      <Route path="/careers" element={<Careers />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.18),transparent_30%),linear-gradient(180deg,#07080d_0%,#0d1119_48%,#07080d_100%)]">
        <main className="min-h-screen">
          <AppRoutes />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container flex min-h-screen flex-col">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow">
        <AppRoutes />
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <CommerceProvider>
          <Router>
            <AppErrorBoundary>
              <AppShell />
            </AppErrorBoundary>
          </Router>
        </CommerceProvider>
      </SiteContentProvider>
    </AuthProvider>
  );
}
