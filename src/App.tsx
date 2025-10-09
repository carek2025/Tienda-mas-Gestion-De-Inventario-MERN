import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductList } from './components/products/ProductList';
import { SalesList } from './components/sales/SalesList';
import { AlertsList } from './components/alerts/AlertsList';
import { initCategories } from './lib/api';

function AuthScreen() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {showRegister ? (
        <RegisterForm onToggle={() => setShowRegister(false)} />
      ) : (
        <LoginForm onToggle={() => setShowRegister(true)} />
      )}
    </div>
  );
}

function MainApp() {
  const { user, loading, signOut } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    // Initialize categories on first load
    if (user) {
      initCategories();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={signOut}
      />
      <main className="flex-1 p-8">
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

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;