import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import { products } from '../../lib/api';
import { ProductForm } from './ProductForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  categoryId: {
    _id: string;
    name: string;
  };
  brand: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  imageUrl: string;
}

export function ProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await products.getAll();
    if (data) setProductList(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      await products.delete(id);
      loadProducts();
    }
  };

  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(undefined);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.categoryId?.name || 'Sin categoría'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description || 'Sin descripción'}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    <p className="text-lg font-bold text-green-600">
                      S/ {product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Stock</p>
                    <p
                      className={`text-lg font-bold ${
                        product.stock <= product.minStock
                          ? 'text-red-600'
                          : 'text-gray-800'
                      }`}
                    >
                      {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowForm(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron productos</p>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setShowForm(false)}
          onSave={loadProducts}
        />
      )}
    </div>
  );
}