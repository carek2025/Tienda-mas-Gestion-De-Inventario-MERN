// components/ecommerce/EcommerceApp.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';
import { Home } from './Home';
import { ProductDetail } from './ProductDetail';
import { Cart } from './Cart';
import { Checkout } from './Checkout';
import { OrderHistory } from './OrderHistory';
import { UserProfile } from './UserProfile';

export function EcommerceApp() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${user?.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [user]);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product: any, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        cartItemCount={cartItemCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="pt-16">
        {activeView === 'home' && (
          <Home
            onProductSelect={setSelectedProduct}
            onViewChange={setActiveView}
            searchTerm={searchTerm}
          />
        )}
        {activeView === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={addToCart}
            onBack={() => setActiveView('home')}
          />
        )}
        {activeView === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setActiveView('checkout')}
            onContinueShopping={() => setActiveView('home')}
          />
        )}
        {activeView === 'checkout' && (
          <Checkout
            cart={cart}
            onOrderComplete={clearCart}
            onBack={() => setActiveView('cart')}
          />
        )}
        {activeView === 'orders' && (
          <OrderHistory onBack={() => setActiveView('home')} />
        )}
        {activeView === 'profile' && (
          <UserProfile onBack={() => setActiveView('home')} />
        )}
      </main>
    </div>
  );
}