// src/components/store/Favorites.tsx (new)
import { useState, useEffect } from 'react';
import { favorites as apiFavorites } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export function Favorites() {
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFavorites.getAll().then(({ data }) => {
      setFavProducts(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (productId: string) => {
    await apiFavorites.remove(productId);
    setFavProducts(prev => prev.filter(p => p._id !== productId));
    toast.success('Removido de favoritos');
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Favoritos</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {favProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-green-600">S/ {product.price.toFixed(2)}</p>
              <button onClick={() => handleRemove(product._id)} className="text-red-600 mt-2"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
      {favProducts.length === 0 && <p>No tienes favoritos.</p>}
    </div>
  );
}