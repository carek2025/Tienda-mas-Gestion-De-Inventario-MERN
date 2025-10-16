// src/components/dashboard/SalesForm.tsx
import { useState, useEffect } from 'react';
import { X, Trash2, Search } from 'lucide-react';
import { products, sales } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  stock: number;
}

interface SaleItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface SalesFormProps {
  onClose: () => void;
  onSave: () => void;
}

export function SalesForm({ onClose, onSave }: SalesFormProps) {
  const { user } = useAuth();
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerDocument, setCustomerDocument] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await products.getAll();
    if (data) {
      const inStockProducts = data.filter((p: Product) => p.stock > 0);
      setProductList(inStockProducts);
    }
  };

  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product: Product) => {
    const existingItem = saleItems.find((item) => item.product._id === product._id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setSaleItems(
          saleItems.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  subtotal: (item.quantity + 1) * product.price,
                }
              : item
          )
        );
      } else {
        toast.warn(`No hay más stock disponible para ${product.name}`);
      }
    } else {
      setSaleItems([
        ...saleItems,
        { product, quantity: 1, subtotal: product.price },
      ]);
    }
    setSearchTerm('');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = saleItems.find((item) => item.product._id === productId);
    if (item && quantity > 0) {
      if (quantity > item.product.stock) {
        toast.warn(`La cantidad no puede exceder el stock disponible (${item.product.stock})`);
        return;
      }
      setSaleItems(
        saleItems.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.product.price,
              }
            : item
        )
      );
    }
  };

  const removeProduct = (productId: string) => {
    setSaleItems(saleItems.filter((item) => item.product._id !== productId));
  };

  const totalAmount = saleItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saleItems.length === 0) {
      toast.error('Debe agregar al menos un producto a la venta');
      return;
    }

    setLoading(true);

    try {
      const saleData = {
        customerName: customerName || 'Cliente Varios',
        customerDocument,
        paymentMethod,
        items: saleItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          subtotal: item.subtotal,
        })),
        totalAmount,
        sellerId: user?.id,
      };

      const { error } = await sales.create(saleData);

      if (error) {
        toast.error('Error al registrar la venta');
      } else {
        toast.success('Venta registrada con éxito');
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Venta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documento
              </label>
              <input
                type="text"
                value={customerDocument}
                onChange={(e) => setCustomerDocument(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="DNI / RUC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Producto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar por nombre, marca o SKU..."
              />
            </div>
            {searchTerm && filteredProducts.length > 0 && (
              <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredProducts.slice(0, 5).map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.brand} - {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          S/ {product.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Productos Seleccionados</h3>
            {saleItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No hay productos seleccionados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {saleItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.product.brand} - S/ {item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.product._id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 text-center px-2 py-1 border border-gray-300 rounded"
                        min="1"
                        max={item.product.stock}
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-24 text-right">
                      <p className="font-bold text-gray-800">
                        S/ {item.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(item.product._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t mt-auto bg-white">
          {saleItems.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-3xl font-bold text-green-600">
                S/ {totalAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || saleItems.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Registrando...' : 'Registrar Venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}