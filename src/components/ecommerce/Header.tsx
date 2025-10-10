// components/ecommerce/Header.tsx
import { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
  cartItemCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ 
  activeView, 
  onViewChange, 
  cartItemCount, 
  searchTerm, 
  onSearchChange 
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onViewChange('home')}
              className="flex items-center space-x-2 text-2xl font-bold text-blue-600"
            >
              <span>🛍️</span>
              <span>TechStore</span>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <button
              onClick={() => onViewChange('favorites')}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors relative"
            >
              <Heart className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={() => onViewChange('cart')}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="hidden sm:block text-sm">{user?.fullName}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      onViewChange('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mis Pedidos
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="grid gap-2">
              <button
                onClick={() => {
                  onViewChange('home');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  onViewChange('orders');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Mis Pedidos
              </button>
              <button
                onClick={() => {
                  onViewChange('profile');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Mi Perfil
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}