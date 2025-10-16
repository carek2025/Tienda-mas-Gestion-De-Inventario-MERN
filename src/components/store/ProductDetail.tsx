// src/components/store/ProductDetail.tsx - MEJORADO
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products as apiProducts, reviews as apiReviews, cart as apiCart, favorites as apiFavorites } from '../../lib/api';
import { Heart, ShoppingCart, Star, Plus, Minus, CheckCircle, XCircle, Share2, MessageCircle, Zap, Truck, Shield, Award } from 'lucide-react';
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
  const [activeImage, setActiveImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('description');

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
        toast.info("🔐 Debes iniciar sesión para añadir productos al carrito.");
        return;
    }
    await apiCart.add(product._id, quantity);
    toast.success(`🎉 ${quantity} x ${product.name} añadido(s) al carrito mágico!`);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleToggleFavorite = async () => {
    if (!user) {
        toast.info("🔐 Debes iniciar sesión para gestionar tus favoritos.");
        return;
    }
    const action = isFavorite ? apiFavorites.remove : apiFavorites.add;
    await action(product._id);
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? '❌ Eliminado de favoritos' : '❤️ Añadido a favoritos mágicos');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.info("🔐 Debes iniciar sesión para dejar una reseña.");
        return;
    }
    if (!newReview.comment.trim()) {
        toast.warn("📝 Por favor, escribe un comentario mágico.");
        return;
    }
    const { data, error } = await apiReviews.create(product._id, newReview);
    if (!error && data) {
      setProductReviews([data, ...productReviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('⭐ ¡Gracias por tu reseña mágica!');
    }
  };
  
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, rev) => sum + rev.rating, 0) / productReviews.length
    : 0;

  const features = [
    { icon: <Truck className="w-5 h-5" />, text: 'Envío gratis en compras +S/200' },
    { icon: <Shield className="w-5 h-5" />, text: 'Garantía de 1 año' },
    { icon: <Award className="w-5 h-5" />, text: 'Calidad premium' },
    { icon: <Zap className="w-5 h-5" />, text: 'Soporte 24/7' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-700 font-semibold">Cargando producto mágico...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Producto no encontrado</h2>
        <p className="text-gray-600 mt-2">Este producto mágico parece haberse esfumado.</p>
      </div>
    </div>
  );

  const imageUrls = [product.imageUrl, '/placeholder.jpg', '/placeholder.jpg'].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Inicio</span>
          <span>›</span>
          <span>Productos</span>
          <span>›</span>
          <span className="text-green-600 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <img 
                src={imageUrls[activeImage]} 
                alt={product.name} 
                className="w-full h-96 object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                    activeImage === index 
                      ? 'border-green-500 scale-105' 
                      : 'border-white/20 hover:border-green-300'
                  }`}
                >
                  <img 
                    src={url} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
              {product.categoryId?.name}
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-gray-500 text-lg mb-6">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-gray-600">
                ({productReviews.length} reseñas mágicas)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                S/ {product.price.toFixed(2)}
              </p>
              <p className="text-green-600 font-semibold mt-1">✅ Precio especial</p>
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
              product.stock > 0 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <span className="font-semibold text-green-600">
                      ¡Disponible! ({product.stock} unidades)
                    </span>
                    <p className="text-sm text-green-700">
                      {product.stock <= 10 ? '⚡ ¡Últimas unidades!' : '📦 En stock listo para enviar'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-red-600">Temporalmente agotado</span>
                </>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="text-green-600">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-2 border-green-200 rounded-2xl p-2 bg-white">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="font-bold text-xl w-12 text-center text-gray-800">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                      className="p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={24} />
                    Añadir al Carrito Mágico
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleToggleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-2xl transition-all duration-300 ${
                      isFavorite 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart fill={isFavorite ? 'currentColor' : 'none'} size={20} />
                    {isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}
                  </button>
                  
                  <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 size={20} />
                    Compartir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: 'description', label: '📖 Descripción Mágica' },
                { id: 'reviews', label: `⭐ Reseñas (${productReviews.length})` },
                { id: 'specs', label: '🔧 Especificaciones' },
                { id: 'shipping', label: '🚚 Envío y Garantía' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 min-w-48 px-6 py-4 font-semibold text-center transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-green-500 text-white border-b-2 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Sobre este Producto Mágico</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">✨ Características Principales</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• Alta calidad y durabilidad</li>
                      <li>• Diseño innovador y moderno</li>
                      <li>• Fácil de usar y mantener</li>
                      <li>• Compatible con estándares</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Beneficios</h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Mejora tu productividad</li>
                      <li>• Ahorra tiempo y esfuerzo</li>
                      <li>• Resultados profesionales</li>
                      <li>• Satisfacción garantizada</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Review Form */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                    Comparte tu Experiencia Mágica
                  </h3>
                  
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tu Calificación Mágica
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tu Comentario Mágico
                      </label>
                      <textarea 
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full border border-gray-300 p-4 rounded-xl h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                        placeholder="Cuéntanos qué magia encontraste en este producto..."
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                    >
                      Publicar Reseña Mágica
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Experiencias de Otros Magos ({productReviews.length})
                  </h3>
                  
                  {productReviews.length > 0 ? (
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                      {productReviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {review.userId?.fullName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {review.userId?.fullName || 'Mago Anónimo'}
                                </p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('es-PE')}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Sé el primero en dejar una reseña mágica para este producto.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Especificaciones Técnicas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Marca</span>
                      <span className="text-gray-800">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">SKU</span>
                      <span className="text-gray-800">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Categoría</span>
                      <span className="text-gray-800">{product.categoryId?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Stock disponible</span>
                      <span className="text-gray-800">{product.stock} unidades</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">⚡ Características Adicionales</h4>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                    <ul className="space-y-2 text-purple-700">
                      <li>• Materiales de primera calidad</li>
                      <li>• Diseño ergonómico y funcional</li>
                      <li>• Fácil instalación y uso</li>
                      <li>• Bajo mantenimiento requerido</li>
                      <li>• Compatible con accesorios estándar</li>
                      <li>• Respetuoso con el medio ambiente</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">🚚 Información de Envío</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-800">Envío Gratis</p>
                        <p className="text-blue-700 text-sm">En compras mayores a S/ 200</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <Zap className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Entrega Rápida</p>
                        <p className="text-green-700 text-sm">2-5 días hábiles a nivel nacional</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                      <Shield className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-semibold text-purple-800">Envío Seguro</p>
                        <p className="text-purple-700 text-sm">Productos asegurados contra daños</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">🛡️ Garantía y Soporte</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                      <Award className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-800">Garantía de 1 Año</p>
                        <p className="text-orange-700 text-sm">Cobertura completa por defectos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                      <MessageCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800">Soporte 24/7</p>
                        <p className="text-red-700 text-sm">Asistencia técnica permanente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                      <div>
                        <p className="font-semibold text-teal-800">Devolución Fácil</p>
                        <p className="text-teal-700 text-sm">30 días para cambios o devoluciones</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}