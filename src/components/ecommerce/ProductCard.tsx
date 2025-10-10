// components/ecommerce/ProductCard.tsx
import { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: any;
  viewMode: 'grid' | 'list';
  onProductSelect: (product: any) => void;
  onViewChange: (view: string) => void;
}

export function ProductCard({ product, viewMode, onProductSelect, onViewChange }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Aquí iría la lógica para añadir al carrito
    console.log('Añadir al carrito:', product);
  };

  const handleProductClick = () => {
    onProductSelect(product);
    onViewChange('product');
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {product.imageUrl && !imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-gray-400 text-center">
                <div className="text-2xl">📦</div>
                <p className="text-xs mt-1">Sin imagen</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className={`p-2 rounded-full ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description || 'Sin descripción disponible'}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">(128)</span>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock > 0 ? 'En stock' : 'Agotado'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  S/ {product.price.toFixed(2)}
                </p>
                {product.cost && (
                  <p className="text-sm text-gray-500 line-through">
                    S/ {(product.price * 1.2).toFixed(2)}
                  </p>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista grid
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
      onClick={handleProductClick}
    >
      <div className="relative">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {product.imageUrl && !imageError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl">📦</div>
              <p className="text-sm mt-2">Sin imagen</p>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isFavorite ? 'text-red-500 bg-white' : 'text-gray-400 bg-white hover:text-red-500'
          }`}
        >
          <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Agotado
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{product.name}</h3>
        </div>

        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(128)</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-green-600">
            S/ {product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}