// src/components/store/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products as apiProducts, reviews as apiReviews, cart as apiCart, favorites as apiFavorites } from '../../lib/api';
import { Heart, ShoppingCart, Star, Plus, Minus, CheckCircle, XCircle, Share2, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        apiProducts.getOne(id),
        apiReviews.getForProduct(id),
        user ? apiFavorites.getAll() : Promise.resolve({ data: [] })
      ]).then(([productRes, reviewsRes, favRes]) => {
        setProduct(productRes.data);
        setProductReviews(reviewsRes.data || []);
        if (favRes.data && productRes.data) {
          setIsFavorite(favRes.data.some((fav: any) => fav._id === productRes.data._id));
        }
      }).finally(() => setLoading(false));
    }
  }, [id, user]);

  const handleAddToCart = async () => {
     if (!user) {
        toast.info("Debes iniciar sesión para añadir productos al carrito.");
        return;
    }
    await apiCart.add(product._id, quantity);
    toast.success(`${quantity} x ${product.name} añadido(s) al carrito!`);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleToggleFavorite = async () => {
    if (!user) {
        toast.info("Debes iniciar sesión para gestionar tus favoritos.");
        return;
    }
    const action = isFavorite ? apiFavorites.remove : apiFavorites.add;
    await action(product._id);
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.info("Debes iniciar sesión para dejar una reseña.");
        return;
    }
    if (!newReview.comment.trim()) {
        toast.warn("Por favor, escribe un comentario.");
        return;
    }
    const { data, error } = await apiReviews.create(product._id, newReview);
    if (!error && data) {
      setProductReviews([data, ...productReviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('¡Gracias por tu reseña!');
    }
  };
  
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, rev) => sum + rev.rating, 0) / productReviews.length
    : 0;

  if (loading) return <div className="text-center py-20">Cargando producto...</div>;
  if (!product) return <div className="text-center py-20">Producto no encontrado.</div>;

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div>
            <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full rounded-lg shadow-lg object-cover" />
          </div>

          {/* Product Details */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{product.categoryId?.name}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.brand}</p>
            
            <div className="flex items-center mt-4">
               <div className="flex items-center">
                   {[...Array(5)].map((_, i) => <Star key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} fill="currentColor" />)}
               </div>
               <span className="ml-2 text-gray-600">({productReviews.length} reseñas)</span>
            </div>

            <p className="text-4xl font-bold text-green-600 my-6">S/ {product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            
            <div className={`mt-6 flex items-center gap-2 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? <CheckCircle /> : <XCircle />}
                <span>{product.stock > 0 ? `${product.stock} unidades en stock` : 'Agotado'}</span>
            </div>
            
            {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <div className="flex items-center gap-2 border rounded-full p-2">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-full hover:bg-gray-100"><Minus /></button>
                        <span className="font-bold w-12 text-center text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2 rounded-full hover:bg-gray-100"><Plus /></button>
                    </div>
                    <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform hover:scale-105">
                      <ShoppingCart /> Añadir al Carrito
                    </button>
                </div>
            )}
            
             <div className="flex gap-4 mt-6">
                <button onClick={handleToggleFavorite} className={`flex items-center gap-2 font-medium py-2 px-4 rounded-full transition ${isFavorite ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}>
                    <Heart fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
                </button>
                 <button className="flex items-center gap-2 font-medium py-2 px-4 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                    <Share2 /> Compartir
                </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
           <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"><MessageCircle />Reseñas de Clientes</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h3 className="font-semibold mb-4">Escribe tu opinión</h3>
                   <form onSubmit={handleSubmitReview} className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                           <div className="flex">
                               {[5,4,3,2,1].map(n => (
                                   <label key={n} className="cursor-pointer">
                                       <input type="radio" value={n} checked={newReview.rating === n} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="sr-only"/>
                                       <Star className={`w-7 h-7 transition-colors ${newReview.rating >= n ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}/>
                                   </label>
                               ))}
                           </div>
                       </div>
                       <textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} className="w-full border p-3 rounded-lg h-28" placeholder="Cuéntanos qué te pareció el producto..." />
                       <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Enviar Reseña</button>
                   </form>
               </div>
                <div>
                   <h3 className="font-semibold mb-4">Opiniones ({productReviews.length})</h3>
                   {productReviews.length > 0 ? (
                       <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                           {productReviews.map((rev) => (
                             <div key={rev._id} className="border-b pb-4">
                               <div className="flex items-center mb-1">
                                 <p className="font-semibold">{rev.userId?.fullName || 'Anónimo'}</p>
                                 <div className="flex items-center ml-auto">
                                     {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < rev.rating ? "text-yellow-400" : "text-gray-300"} fill="currentColor" />)}
                                 </div>
                               </div>
                               <p className="text-gray-600 text-sm">{rev.comment}</p>
                             </div>
                           ))}
                       </div>
                   ) : <p className="text-gray-500">Sé el primero en dejar una reseña para este producto.</p>}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}