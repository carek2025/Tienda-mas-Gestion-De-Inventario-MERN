// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initCategories } from './lib/api';

// Auth Components
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Dashboard Components
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductList } from './components/products/ProductList';
import { SalesList } from './components/sales/SalesList';
import { AlertsList } from './components/alerts/AlertsList';

// Store Components
import { Home } from './components/store/Home';
import { Products } from './components/store/Products';
import { ProductDetail } from './components/store/ProductDetail';
import { Cart } from './components/store/Cart';
import { Checkout } from './components/store/Checkout';
import { Favorites } from './components/store/Favorites';
import { History } from './components/store/History';
import { Profile } from './components/store/Profile';
import { Contact } from './components/store/Contact';

// Loading Spinner Component
const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Auth Screen
function AuthScreen({ type }: { type: 'login' | 'register' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {type === 'register' ? <RegisterForm /> : <LoginForm />}
    </div>
  );
}

// Dashboard Layout
function DashboardLayout() {
  const { user, loading, signOut } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    if (user) {
      initCategories();
    }
  }, [user]);

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user || user.role !== 'staff') {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={signOut}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'products' && <ProductList />}
          {activeView === 'sales' && <SalesList />}
          {activeView === 'alerts' && <AlertsList />}
        </div>
      </main>
    </div>
  );
}

// Store Layout
function StoreLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Protected Route
function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: { 
  children: React.ReactNode
  requireAuth?: boolean 
}) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (requireAuth && !user) return <Navigate to="/login" />;
  return <>{children}</>;
}

// Main App Routes
function MainApp() {
  const { loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthScreen type="login" />} />
      <Route path="/register" element={<AuthScreen type="register" />} />
      <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
      <Route path="/product/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
      <Route 
        path="/cart" 
        element={
          <StoreLayout>
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </StoreLayout>
        } 
      />
      <Route 
        path="/favorites" 
        element={
          <StoreLayout>
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          </StoreLayout>
        } 
      />
      <Route 
        path="/history" 
        element={
          <StoreLayout>
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          </StoreLayout>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <StoreLayout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </StoreLayout>
        } 
      />
      <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
      <Route 
        path="/checkout" 
        element={
          <StoreLayout>
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          </StoreLayout>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </Router>
  );
}

export default App;