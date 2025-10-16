// src/components/store/Products.tsx (new)
import { useState, useEffect } from 'react';
import { products as apiProducts, categories } from '../../lib/api';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';

export function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    priceMin: 0,
    priceMax: Infinity,
    availability: 'all',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiProducts.getAll().then(({ data }) => {
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    });
    categories.getAll().then(({ data }) => setCategoriesList(data));
  }, []);

  useEffect(() => {
    let filtered = products;
    const search = searchParams.get('search')?.toLowerCase();

    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId?._id === filters.category);
    }

    filtered = filtered.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

    if (filters.availability === 'inStock') {
      filtered = filtered.filter(p => p.stock > 0);
    }

    setFilteredProducts(filtered);
  }, [filters, searchParams, products]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 flex gap-8">
      <aside className="w-64 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Filter /> Filtros</h2>
        <div>
          <label className="block mb-2">Categoría</label>
          <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="w-full border p-2 rounded">
            <option value="">Todas</option>
            {categoriesList.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-2">Precio Mínimo</label>
          <input type="number" value={filters.priceMin} onChange={(e) => handleFilterChange('priceMin', parseFloat(e.target.value) || 0)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-2">Precio Máximo</label>
          <input type="number" value={filters.priceMax === Infinity ? '' : filters.priceMax} onChange={(e) => handleFilterChange('priceMax', parseFloat(e.target.value) || Infinity)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-2">Disponibilidad</label>
          <select value={filters.availability} onChange={(e) => handleFilterChange('availability', e.target.value)} className="w-full border p-2 rounded">
            <option value="all">Todos</option>
            <option value="inStock">En stock</option>
          </select>
        </div>
      </aside>
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-8">Productos</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="bg-white rounded-lg shadow hover:shadow-lg">
                <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-green-600">S/ {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{product.stock > 0 ? 'En stock' : 'Agotado'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {filteredProducts.length === 0 && <p>No se encontraron productos.</p>}
      </div>
    </div>
  );
}