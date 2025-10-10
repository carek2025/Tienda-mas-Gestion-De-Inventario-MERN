// components/ecommerce/ProductDetail.tsx
import { useState } from 'react';
import { ArrowLeft, Heart, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductDetailProps {
  product: any;
  onAddToCart: (product: any, quantity: number) => void;
  onBack: () => void;
}

export function ProductDetail({ product, onAddToCart, onBack }: ProductDetailProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const productImages = [
    product.imageUrl,
    'https://via.placeholder.com/600x600?text=Imagen+2',
    'https://via.placeholder.com/600x600?text=Imagen+3',
    'https://via.placeholder.com/600x600?text=Imagen+4'
  ].filter(Boolean);

  const handleAddToCart = () => {
    onAddToCart(product, selectedQuantity);
    // Mostrar notificación o feedback
    alert(`¡${selectedQuantity} ${product.name} añadido(s) al carrito!`);
  };

  const features = [
    { icon: Truck, text: 'Envío gratis en compras mayores a S/ 100' },
    { icon: Shield, text: 'Garantía del fabricante' },
    { icon: RotateCcw, text: 'Devolución gratuita en 30 días' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navegación */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a la tienda
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          {/* Imagen principal */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-100 flex items-center justify-center">
              {productImages[selectedImage] && !imageError ? (
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-6xl">📦</div>
                  <p className="text-lg mt-4">Imagen no disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Miniaturas */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setImageError(false);
                  }}
                  className={`bg-white border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="h-20 bg-gray-100 flex items-center justify-center">
                    {image && !imageError ? (
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">📦</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">4.0</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-blue-600 hover:underline cursor-pointer">128 reseñas</span>
              <span className="text-gray-500">•</span>
              <span className="text-green-600 font-medium">
                {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
              </span>
            </div>
          </div>

          {/* Precio */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-green-600">
                S/ {product.price.toFixed(2)}
              </span>
              {product.cost && (
                <span className="text-xl text-gray-500 line-through">
                  S/ {(product.price * 1.2).toFixed(2)}
                </span>
              )}
              {product.cost && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                  20% OFF
                </span>
              )}
            </div>
            <p className="text-gray-600">Precio incluye IGV</p>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'Este producto no cuenta con una descripción detallada. Contáctanos para más información.'}
            </p>
          </div>

          {/* Especificaciones */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Especificaciones</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">SKU:</span>
                <span className="ml-2 text-gray-800">{product.sku}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Marca:</span>
                <span className="ml-2 text-gray-800">{product.brand}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Categoría:</span>
                <span className="ml-2 text-gray-800">{product.categoryId?.name || 'Sin categoría'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Disponibilidad:</span>
                <span className={`ml-2 font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? 'En stock' : 'Agotado'}
                </span>
              </div>
            </div>
          </div>

          {/* Cantidad y acciones */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Cantidad:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  disabled={selectedQuantity <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{selectedQuantity}</span>
                <button
                  onClick={() => setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))}
                  disabled={selectedQuantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Máximo: {product.stock} unidades
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                Añadir al Carrito
              </button>
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-lg border-2 ${
                  isFavorite 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500'
                } transition-colors`}
              >
                <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Características */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reseñas y preguntas */}
      <div className="mt-12 border-t pt-8">
        <div className="flex border-b">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Reseñas (128)
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
            Preguntas y respuestas (45)
          </button>
        </div>

        <div className="py-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">4.0</div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">128 calificaciones</div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-4">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {rating === 5 ? '60%' : rating === 4 ? '25%' : rating === 3 ? '10%' : rating === 2 ? '3%' : '2%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ejemplo de reseña */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                JP
              </div>
              <div>
                <div className="font-semibold">Juan Pérez</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">
              Excelente producto, superó mis expectativas. La calidad es excelente y el envío fue muy rápido. ¡Totalmente recomendado!
            </p>
            <div className="text-sm text-gray-500 mt-2">Hace 2 días</div>
          </div>
        </div>
      </div>
    </div>
  );
}