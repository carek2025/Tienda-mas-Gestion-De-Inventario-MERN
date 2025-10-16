// src/components/store/ProductDetail.tsx (new)
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products as apiProducts, reviews, cart, favorites } from '../../lib/api';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-toastify';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiProducts.getOne(id).then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
      reviews.getForProduct(id).then(({ data }) => setProductReviews(data));
      favorites.getAll().then(({ data }) => setIsFavorite(data.includes(id)));
    }
  }, [id]);

  const handleAddToCart = async () => {
    await cart.add(product._id, 1);
    toast.success('Añadido al carrito');
  };

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await favorites.remove(product._id);
    } else {
      await favorites.add(product._id);
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removido de favoritos' : 'Añadido a favoritos');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await reviews.create(product._id, newReview);
    setProductReviews([...productReviews, data]);
    setNewReview({ rating: 5, comment: '' });
    toast.success('Reseña añadida');
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-7xl mx-auto py-8 flex gap-8">
      <div className="w-1/2">
        <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full rounded-lg" />
      </div>
      <div className="w-1/2 space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-green-600">S/ {product.price.toFixed(2)}</p>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-sm">Stock: {product.stock}</p>
        <div className="flex gap-4">
          <button onClick={handleAddToCart} className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
            <ShoppingCart /> Añadir al Carrito
          </button>
          <button onClick={handleToggleFavorite} className={`px-6 py-2 rounded ${isFavorite ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
            <Heart /> {isFavorite ? 'Remover Favorito' : 'Añadir Favorito'}
          </button>
        </div>
      </div>
      <div className="w-full mt-12">
        <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
        {productReviews.map((rev, idx) => (
          <div key={idx} className="border-b py-4">
            <div className="flex items-center gap-2">
              {Array(rev.rating).fill(0).map((_, i) => <Star key={i} className="text-yellow-400" />)}
            </div>
            <p>{rev.comment}</p>
          </div>
        ))}
        <form onSubmit={handleSubmitReview} className="mt-8 space-y-4">
          <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="border p-2">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
          </select>
          <textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} className="w-full border p-2" placeholder="Escribe tu reseña..." />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enviar Reseña</button>
        </form>
      </div>
    </div>
  );
}