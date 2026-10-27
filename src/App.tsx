import React, { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';
import { Toast } from './components/Toast';
import { ProductModal } from './components/ProductModal';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { StoreHomePage } from './pages/StoreHomePage';
import { CategoryPage } from './pages/CategoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { SupportPage } from './pages/SupportPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { RulesPage } from './pages/RulesPage';
import { VotePage } from './pages/VotePage';
import { StaffPage } from './pages/StaffPage';
import { ApplyPage } from './pages/ApplyPage';
import { Product, ProductCategory } from './types';

function getNormalizedPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash && hash.startsWith('/')) {
    return hash;
  }
  let pathname = window.location.pathname || '/';
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    // On github.io, the first path segment is repo name (e.g. /repo-name/category)
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1) {
      pathname = '/' + parts.slice(1).join('/');
    } else {
      pathname = '/';
    }
  }
  return pathname || '/';
}

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => getNormalizedPath());

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { categories } = useProducts();

  // Handle browser back/forward buttons & hash routing
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(getNormalizedPath());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    if (isGitHubPages) {
      window.location.hash = path;
    } else {
      try {
        window.history.pushState({}, '', path);
      } catch {
        window.location.hash = path;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleOpenProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const handleDirectBuy = (product: Product, quantity = 1, selectedBilling?: 'monthly' | 'permanent') => {
    addToCart(product, quantity, selectedBilling);
    const label = selectedBilling ? ` [${selectedBilling.toUpperCase()}]` : '';
    showToast(`Added ${quantity}x ${product.name}${label} to cart!`);
    navigate('/cart');
  };

  // Route parser
  const renderCurrentPage = () => {
    // 1. Home Page
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          navigate={navigate}
          onOpenProductModal={handleOpenProductModal}
          onDirectBuy={handleDirectBuy}
          onShowToast={showToast}
        />
      );
    }

    // 2. Store Hub Landing Page
    if (currentPath === '/store') {
      return (
        <StoreHomePage
          navigate={navigate}
          onOpenProductModal={handleOpenProductModal}
          onDirectBuy={handleDirectBuy}
          onShowToast={showToast}
        />
      );
    }

    // 3. Category Pages: /store/:category
    if (currentPath.startsWith('/store/')) {
      const slug = currentPath.replace('/store/', '').split('/')[0] as ProductCategory;
      return (
        <CategoryPage
          categorySlug={slug}
          navigate={navigate}
          onOpenProductModal={handleOpenProductModal}
          onDirectBuy={handleDirectBuy}
        />
      );
    }

    // 4. Cart Page
    if (currentPath === '/cart') {
      return <CartPage navigate={navigate} onShowToast={showToast} />;
    }

    // 5. Checkout Page
    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} onShowToast={showToast} />;
    }

    // 6. User Account Pages: /login, /register, /profile
    if (currentPath === '/login') {
      return (
        <UserAccountPage
          viewMode="login"
          navigate={navigate}
          onShowToast={showToast}
        />
      );
    }
    if (currentPath === '/register') {
      return (
        <UserAccountPage
          viewMode="register"
          navigate={navigate}
          onShowToast={showToast}
        />
      );
    }
    if (currentPath === '/profile') {
      return (
        <UserAccountPage
          viewMode="profile"
          navigate={navigate}
          onShowToast={showToast}
        />
      );
    }

    // 7. Rules Page (matching AppleMC screenshot)
    if (currentPath === '/rules') {
      return <RulesPage navigate={navigate} onShowToast={showToast} />;
    }

    // 8. Vote Page (matching AppleMC screenshot)
    if (currentPath === '/vote') {
      return <VotePage navigate={navigate} onShowToast={showToast} />;
    }

    // 9. Staff Team Page (matching AppleMC screenshot)
    if (currentPath === '/staff') {
      return <StaffPage navigate={navigate} onShowToast={showToast} />;
    }

    // 10. Apply & Recruitment Hub (matching AppleMC screenshot)
    if (currentPath === '/apply') {
      return <ApplyPage navigate={navigate} onShowToast={showToast} />;
    }

    // 11. Support & FAQs Page
    if (currentPath === '/support') {
      return <SupportPage onShowToast={showToast} />;
    }

    // 12. Admin Dashboard & Login
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminDashboard onShowToast={showToast} navigate={navigate} />;
    }

    // Default Fallback: Home
    return (
      <HomePage
        navigate={navigate}
        onOpenProductModal={handleOpenProductModal}
        onDirectBuy={handleDirectBuy}
        onShowToast={showToast}
      />
    );
  };

  const hasDedicatedFooter = ['/', '/rules', '/vote', '/staff', '/apply'].includes(currentPath);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative">
      {/* Background Minecraft Style Ambient Glow & Particles */}
      <ParticleBackground />

      {/* Persistent Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        openSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Routed Content View */}
      <main className="flex-1 relative z-10">{renderCurrentPage()}</main>

      {/* Persistent Footer for other pages without dedicated AppleFooter */}
      {!hasDedicatedFooter && <Footer navigate={navigate} />}

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        navigate={navigate}
        onSelectProduct={handleOpenProductModal}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
          onBuyNow={(prod, qty) => {
            addToCart(prod, qty);
            showToast(`Added ${qty}x ${prod.name} to cart!`);
            navigate('/cart');
          }}
        />
      )}

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <AuthProvider>
          <ProductsProvider>
            <MainApp />
          </ProductsProvider>
        </AuthProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
