// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Search, Menu, X, BarChart3, Home, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cart as apiCart } from '../../lib/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Custom hook to update cart count
  const useCartCount = () => {
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
      
      updateCart(); // Initial fetch
      window.addEventListener('cartUpdated', updateCart);
      return () => window.removeEventListener('cartUpdated', updateCart);
    }, [user]);
  };
  
  useCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('¡Sesión cerrada con éxito!');
  };

  const navLinks = [
    { to: '/', text: 'Inicio', icon: <Home size={20} /> },
    { to: '/products', text: 'Productos', icon: <Package size={20} /> },
    { to: '/contact', text: 'Contacto', icon: <User size={20} /> },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold text-blue-600 transition-transform duration-300 hover:scale-105">
              TechStore
            </Link>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input
                  type="text"
                  placeholder="Busca herramientas, electrodomésticos y más..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </form>
          </div>

          {/* Icons and Auth - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/favorites" className="relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Favoritos">
                  <Heart />
                </Link>
                <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Carrito">
                  <ShoppingCart />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Perfil">
                  <User />
                </Link>
                {user.role === 'staff' && (
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Dashboard">
                    <BarChart3 />
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" aria-label="Cerrar Sesión">
                  <LogOut />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 px-4 py-2 rounded-full transition-colors">Iniciar Sesión</Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-px">Registrarse</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors mr-2" aria-label="Carrito">
                <ShoppingCart />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4 px-2">
           <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </form>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                {link.icon} {link.text}
              </Link>
            ))}
            <hr />
            {user ? (
               <>
                <Link to="/profile" className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(false)}><User size={20} /> Mi Perfil</Link>
                <Link to="/favorites" className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(false)}><Heart size={20} /> Mis Favoritos</Link>
                {user.role === 'staff' && (
                   <Link to="/dashboard" className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(false)}><BarChart3 size={20}/> Dashboard</Link>
                )}
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-red-600 font-medium p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left">
                  <LogOut size={20} /> Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center text-gray-600 font-medium hover:text-blue-600 py-3 rounded-full transition-colors border border-gray-300">Iniciar Sesión</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-all font-semibold">Registrarse</Link>
              </div>
            )}
          </nav>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </header>
  );
}