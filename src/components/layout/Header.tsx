// src/components/layout/Header.tsx - MEJORADO
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Search, Menu, X, BarChart3, Home, Package, History, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cart as apiCart } from '../../lib/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart count listener
  useEffect(() => {
    const updateCart = () => {
      if (user) {
        apiCart.get().then(({ data }) => {
          setCartCount(data?.items?.length || 0);
        });
      } else {
        setCartCount(0);
      }
    };
    
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('🎉 ¡Sesión cerrada!');
  };

  const navLinks = [
    { to: '/', text: '🏠 Inicio', icon: <Home size={20} /> },
    { to: '/products', text: '🛍️ Productos', icon: <Package size={20} /> },
    { to: '/contact', text: '📞 Contacto', icon: <User size={20} /> },
  ];

  const userLinks = [
    { to: '/profile', text: '👤 Mi Perfil', icon: <User size={20} /> },
    { to: '/favorites', text: '❤️ Favoritos', icon: <Heart size={20} /> },
    { to: '/history', text: '📊 Historial', icon: <History size={20} /> },
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-white/20' 
        : 'bg-white/90 backdrop-blur-lg shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                TechStore
              </span>
            </Link>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors" size={20}/>
                <input
                  type="text"
                  placeholder="🔍 Busca herramientas mágicas, electrodomésticos y más..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-300 group-hover:border-purple-300 group-hover:shadow-lg"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Icons and Auth - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* User Links */}
                {userLinks.map(link => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className={`relative p-3 rounded-2xl transition-all duration-300 group ${
                      isActiveLink(link.to)
                        ? 'bg-purple-100 text-purple-600 shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                    aria-label={link.text}
                  >
                    {link.icon}
                    {isActiveLink(link.to) && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                    )}
                  </Link>
                ))}

                {/* Cart with Counter */}
                <Link 
                  to="/cart" 
                  className="relative p-3 rounded-2xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
                  aria-label="Carrito"
                >
                  <ShoppingCart />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Staff Dashboard */}
                {user.role === 'staff' && (
                  <Link 
                    to="/dashboard" 
                    className="p-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                    aria-label="Dashboard"
                  >
                    <BarChart3 />
                  </Link>
                )}

                {/* Logout */}
                <button 
                  onClick={handleLogout} 
                  className="p-3 rounded-2xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group"
                  aria-label="Cerrar Sesión"
                >
                  <LogOut />
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 font-medium hover:text-purple-600 px-6 py-2 rounded-2xl hover:bg-purple-50 transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  ✨ Registrarse
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Cart Counter for Mobile */}
            <Link 
              to="/cart" 
              className="relative p-3 rounded-2xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
              aria-label="Carrito"
            >
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-3 rounded-2xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className={`md:hidden pb-4 px-2 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors" size={20}/>
              <input
                type="text"
                placeholder="🔍 Buscar productos ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-300"
              />
            </div>
          </form>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 transition-all duration-500 ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <nav className="flex flex-col p-4 space-y-2">
          {/* Main Navigation */}
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                isActiveLink(link.to)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon}
              <span className="font-semibold text-lg">{link.text}</span>
            </Link>
          ))}
          
          <hr className="my-2 border-gray-200" />
          
          {/* User Specific Links */}
          {user ? (
            <>
              {userLinks.map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                    isActiveLink(link.to)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="font-semibold text-lg">{link.text}</span>
                </Link>
              ))}
              
              {user.role === 'staff' && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-4 p-4 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 size={24}/>
                  <span className="font-semibold text-lg">📊 Dashboard</span>
                </Link>
              )}
              
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                className="flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-300 w-full text-left"
              >
                <LogOut size={24} />
                <span className="font-semibold text-lg">🚪 Cerrar Sesión</span>
              </button>

              {/* User Info */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{user.fullName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-center text-gray-600 font-semibold hover:text-purple-600 py-4 rounded-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-300"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-lg"
              >
                ✨ Crear Cuenta
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        toastClassName="rounded-2xl"
        progressClassName="bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </header>
  );
}