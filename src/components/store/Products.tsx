// src/components/store/Products.tsx
import { useState, useEffect } from 'react';
import { products as apiProducts, categories as apiCategories } from '../../lib/api';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, List, LayoutGrid } from 'lucide-react';

// Reusing ProductCard from Home page for consistency
function ProductCard({ product }: { product: any }) {
    const { _id, name, price, imageUrl, stock, brand } = product;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        // Add to cart logic here, potentially from a context
        console.log(`Added ${name} to cart`);
    };

    return (
        <Link to={`/product/${_id}`} className="bg-white rounded-lg shadow-md overflow-hidden group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col">
            <div className="relative">
                <img src={imageUrl || '/placeholder.jpg'} alt={name} className="w-full h-56 object-cover group-hover:opacity-80 transition-opacity" />
                {stock <= 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">Agotado</span>}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm text-gray-500">{brand}</p>
                <h3 className="font-bold text-gray-800 mt-1 flex-grow">{name}</h3>
                <p className="text-xl font-bold text-green-600 mt-4">S/ {price.toFixed(2)}</p>
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
    const search = searchParams.get('search')?.toLowerCase();

    if (search) {
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
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
    }

    setFilteredProducts(tempProducts);
    
    // Update URL search params
    const newSearchParams = new URLSearchParams();
    if(search) newSearchParams.set('search', search);
    if(filters.category) newSearchParams.set('category', filters.category);
    if(filters.priceMin) newSearchParams.set('priceMin', filters.priceMin);
    if(filters.priceMax) newSearchParams.set('priceMax', filters.priceMax);
    if(filters.sortBy !== 'relevance') newSearchParams.set('sortBy', filters.sortBy);
    setSearchParams(newSearchParams);

  }, [filters, searchParams, products, setSearchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({ category: '', priceMin: '', priceMax: '', sortBy: 'relevance' });
    setSearchParams(new URLSearchParams(searchParams.get('search') ? { search: searchParams.get('search')! } : {}));
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Nuestro Catálogo</h1>
            <p className="mt-4 text-lg text-gray-600">Encuentra todo lo que necesitas para tus proyectos y tu hogar.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
               <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Filter /> Filtros</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Categoría</label>
                    <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="w-full border p-2 rounded-lg bg-gray-50">
                      <option value="">Todas</option>
                      {categoriesList.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Precio</label>
                    <div className="flex gap-2 items-center">
                        <input type="number" placeholder="Mín" value={filters.priceMin} onChange={(e) => handleFilterChange('priceMin', e.target.value)} className="w-full border p-2 rounded-lg bg-gray-50" />
                        <span>-</span>
                        <input type="number" placeholder="Máx" value={filters.priceMax} onChange={(e) => handleFilterChange('priceMax', e.target.value)} className="w-full border p-2 rounded-lg bg-gray-50" />
                    </div>
                  </div>
                   <button onClick={clearFilters} className="w-full text-center text-blue-600 font-semibold hover:underline">Limpiar Filtros</button>
                </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
             <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-6">
                <p className="text-gray-600"><span className="font-bold">{filteredProducts.length}</span> resultados</p>
                <div className="flex items-center gap-4">
                   <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)} className="border p-2 rounded-lg bg-gray-50 text-sm">
                       <option value="relevance">Relevancia</option>
                       <option value="price-asc">Precio: Menor a Mayor</option>
                       <option value="price-desc">Precio: Mayor a Menor</option>
                       <option value="name-asc">Nombre: A-Z</option>
                       <option value="name-desc">Nombre: Z-A</option>
                   </select>
                   <div className="hidden sm:flex items-center border rounded-lg">
                       <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}><LayoutGrid size={20}/></button>
                       <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}><List size={20}/></button>
                   </div>
                </div>
             </div>
            {loading ? <p>Cargando...</p> : (
               <>
                {filteredProducts.length > 0 ? (
                    viewMode === 'grid' ? (
                       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)}
                       </div>
                    ) : (
                        <div className="space-y-4">
                            {/* List View Component would go here */}
                            <p>List view coming soon!</p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">No se encontraron productos</h3>
                        <p className="text-gray-500 mt-2">Intenta ajustar tus filtros o buscar con otros términos.</p>
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