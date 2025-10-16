// src/components/store/Favorites.tsx - MEJORADO
import { useState, useEffect } from 'react';
import { favorites as apiFavorites, cart as apiCart } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

export function Favorites() {
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    apiFavorites.getAll().then(({ data }) => {
      setFavProducts(data || []);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (productId: string) => {
    await apiFavorites.remove(productId);
    setFavProducts(prev => prev.filter(p => p._id !== productId));
    toast.info('❌ Producto eliminado de favoritos');
  };

  const handleAddToCart = async (productId: string) => {
    await apiCart.add(productId, 1);
    toast.success('🛒 Producto añadido al carrito');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        </div>
        <p className="text-purple-700 font-semibold">Cargando tus favoritos...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header con efecto especial */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce"></div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
            Mis favoritos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tus productos favoritos están aquí. ¡No dejes que se escapen!
          </p>
        </div>

        {favProducts.length === 0 ? (
          <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
            <div className="relative inline-block">
              <Heart size={80} className="mx-auto text-gray-300 mb-4" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Tu galería de favoritos está vacía</h2>
            <p className="text-gray-500 mb-6">Los productos que amas aparecerán aquí como estrellas en el cielo.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5" />
              Explorar Productos Mágicos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favProducts.map((product, index) => (
              <div 
                key={product._id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/30 ${
                  hoveredCard === product._id ? 'ring-2 ring-purple-500' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(product._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.imageUrl || '/placeholder.jpg'} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ⭐ Favorito
                    </span>
                    {product.stock <= 10 && product.stock > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🔥 Últimas {product.stock}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      S/ {product.price.toFixed(2)}
                    </p>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                    >
                      <ShoppingCart size={16} /> Añadir
                    </button>
                    <button 
                      onClick={() => handleRemove(product._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {favProducts.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600">{favProducts.length}</div>
                <div className="text-sm text-gray-600">Productos Guardados</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  S/ {favProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(favProducts.reduce((sum, p) => sum + p.price, 0) / favProducts.length || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Precio Promedio</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-pink-600">
                  {favProducts.filter(p => p.stock <= 10).length}
                </div>
                <div className="text-sm text-gray-600">Stock Bajo</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}