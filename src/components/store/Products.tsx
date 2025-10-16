// src/components/store/Products.tsx - MEJORADO
import { useState, useEffect } from 'react';
import { products as apiProducts, categories as apiCategories, cart as apiCart } from '../../lib/api';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Sparkles, Zap, TrendingUp, Star, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

// ProductCard Mejorado
function ProductCard({ product, viewMode = 'grid' }: { product: any; viewMode?: 'grid' | 'list' }) {
  const { _id, name, price, imageUrl, stock, brand, description } = product;
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await apiCart.add(_id, 1);
      toast.success(`🎉 ${name} añadido al carrito mágico!`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch {
      toast.error('⚡ Error al añadir al carrito');
    }
  };

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/product/${_id}`}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0">
            <img 
              src={imageUrl || '/placeholder.jpg'} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {stock <= 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                🔥 Agotado
              </span>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-semibold">{brand}</p>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                  {name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  S/ {price.toFixed(2)}
                </p>
                <button
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link 
      to={`/product/${_id}`} 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl || '/placeholder.jpg'} 
          alt={name} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {stock <= 0 ? (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 Agotado
            </span>
          ) : stock <= 10 ? (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              ⚡ Últimas {stock}
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              ✅ En stock
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            <Eye size={16} />
            Ver Detalles
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 font-semibold">{brand}</p>
        <h3 className="font-bold text-gray-800 mt-1 flex-grow group-hover:text-purple-600 transition-colors">
          {name}
        </h3>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            S/ {price.toFixed(2)}
          </p>
          
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sortBy: searchParams.get('sortBy') || 'relevance',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    Promise.all([
      apiProducts.getAll(),
      apiCategories.getAll()
    ]).then(([productsRes, categoriesRes]) => {
      setProducts(productsRes.data || []);
      setCategoriesList(categoriesRes.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    if (searchTerm) {
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.category) {
      tempProducts = tempProducts.filter(p => p.categoryId?._id === filters.category);
    }
    
    if (filters.priceMin) {
      tempProducts = tempProducts.filter(p => p.price >= parseFloat(filters.priceMin));
    }
    
    if (filters.priceMax) {
      tempProducts = tempProducts.filter(p => p.price <= parseFloat(filters.priceMax));
    }
    
    // Sorting
    switch (filters.sortBy) {
      case 'price-asc': tempProducts.sort((a, b) => a.price - b.price); break;
      case 'price-desc': tempProducts.sort((a, b) => b.price - a.price); break;
      case 'name-asc': tempProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': tempProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'popular': tempProducts.sort((a, b) => (b.stock <= 10 ? 1 : 0) - (a.stock <= 10 ? 1 : 0)); break;
    }

    setFilteredProducts(tempProducts);
    
    // Update URL search params
    const newSearchParams = new URLSearchParams();
    if(searchTerm) newSearchParams.set('search', searchTerm);
    if(filters.category) newSearchParams.set('category', filters.category);
    if(filters.priceMin) newSearchParams.set('priceMin', filters.priceMin);
    if(filters.priceMax) newSearchParams.set('priceMax', filters.priceMax);
    if(filters.sortBy !== 'relevance') newSearchParams.set('sortBy', filters.sortBy);
    setSearchParams(newSearchParams);

  }, [filters, searchTerm, products, setSearchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({ category: '', priceMin: '', priceMax: '', sortBy: 'relevance' });
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  }

  const featuredCategories = categoriesList.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-8 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-12 right-1/3 w-12 h-12 bg-pink-400/20 rounded-full blur-xl"></div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Galería Mágica
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre productos encantados que transformarán tu mundo
          </p>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {featuredCategories.map((category, index) => (
            <div 
              key={category._id}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/20"
              onClick={() => handleFilterChange('category', category._id)}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Explorar</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Filtros Mágicos</h2>
              </div>
              
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">🔍 Buscar Productos</label>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Escribe tu búsqueda mágica..."
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">📦 Categoría</label>
                  <select 
                    value={filters.category} 
                    onChange={(e) => handleFilterChange('category', e.target.value)} 
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50"
                  >
                    <option value="">Todas las categorías</option>
                    {categoriesList.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">💰 Rango de Precio</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      placeholder="Mín" 
                      value={filters.priceMin} 
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)} 
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50" 
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                      type="number" 
                      placeholder="Máx" 
                      value={filters.priceMax} 
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)} 
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50" 
                    />
                  </div>
                </div>

                <button 
                  onClick={clearFilters}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  🧹 Limpiar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header con controles */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-gray-600">
                    <span className="font-bold text-purple-600">{filteredProducts.length}</span> productos mágicos encontrados
                  </p>
                  
                  {/* View Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setViewMode('grid')} 
                      className={`p-3 transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-4 h-4 grid grid-cols-2 gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-current rounded-sm" />
                        ))}
                      </div>
                    </button>
                    <button 
                      onClick={() => setViewMode('list')} 
                      className={`p-3 transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-4 h-4 flex flex-col justify-between">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-0.5 bg-current rounded-full" />
                        ))}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sort */}
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)} 
                  className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50"
                >
                  <option value="relevance">✨ Relevancia Mágica</option>
                  <option value="price-asc">💰 Precio: Menor a Mayor</option>
                  <option value="price-desc">💰 Precio: Mayor a Menor</option>
                  <option value="name-asc">🔤 Nombre: A-Z</option>
                  <option value="name-desc">🔤 Nombre: Z-A</option>
                  <option value="popular">🔥 Más Populares</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-purple-700 font-semibold">Cargando productos mágicos...</p>
              </div>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProducts.map((product, index) => (
                        <ProductCard 
                          key={product._id} 
                          product={product} 
                          viewMode="grid"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.map((product, index) => (
                        <ProductCard 
                          key={product._id} 
                          product={product} 
                          viewMode="list"
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-white/20">
                    <Zap size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">¡No se encontraron productos!</h3>
                    <p className="text-gray-500 mb-6">Intenta ajustar tus filtros mágicos o buscar con otros términos.</p>
                    <button 
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                    >
                      Mostrar Todos los Productos
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}