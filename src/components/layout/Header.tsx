// src/components/layout/Header.tsx (new)
import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Search, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cart } from '../../lib/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      cart.get().then(({ data }) => {
        if (data) {
          setCartCount(data.items.length);
        }
      });
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Sesión cerrada');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">TechStore</Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-blue-600">Productos</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contacto</Link>
          {user ? (
            <>
              <Link to="/favorites" className="relative text-gray-600 hover:text-blue-600">
                <Heart />
              </Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
                <ShoppingCart />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">{cartCount}</span>}
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                <User />
              </Link>
              {user.role === 'staff' && (
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                  <BarChart3 />
                </Link>
              )}
              <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">
                <LogOut />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Iniciar Sesión</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Registrarse</Link>
            </>
          )}
        </nav>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </header>
  );
}