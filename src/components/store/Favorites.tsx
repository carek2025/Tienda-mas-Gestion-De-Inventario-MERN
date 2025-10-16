// src/components/store/Favorites.tsx
import { useState, useEffect } from 'react';
import { favorites as apiFavorites, cart as apiCart } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

export function Favorites() {
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFavorites.getAll().then(({ data }) => {
      setFavProducts(data || []);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (productId: string) => {
    await apiFavorites.remove(productId);
    setFavProducts(prev => prev.filter(p => p._id !== productId));
    toast.info('Producto eliminado de favoritos');
  };

  const handleAddToCart = async (productId: string) => {
    await apiCart.add(productId, 1);
    toast.success('Producto añadido al carrito');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
  
  if (loading) return <div className="text-center py-20">Cargando tus favoritos...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Heart size={36} className="text-red-500"/>
          Mis Favoritos
        </h1>

        {favProducts.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Aún no tienes favoritos</h2>
            <p className="text-gray-500 mt-2 mb-6">Explora nuestros productos y guarda los que más te gusten haciendo clic en el corazón.</p>
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-transform hover:scale-105 inline-block">
              Descubrir Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group transform transition-transform hover:-translate-y-2">
                <Link to={`/product/${product._id}`}>
                  <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-lg font-semibold text-green-600 mt-2">S/ {product.price.toFixed(2)}</p>
                  <div className="mt-4 flex gap-2">
                     <button onClick={() => handleAddToCart(product._id)} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition">
                      <ShoppingCart size={16}/> Añadir
                    </button>
                    <button onClick={() => handleRemove(product._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}