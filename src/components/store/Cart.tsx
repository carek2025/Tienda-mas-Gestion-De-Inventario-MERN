// src/components/store/Cart.tsx - ACTUALIZADO
import { useState, useEffect } from 'react';
import { cart as apiCart } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

export function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const fetchCart = async () => {
    if (user) {
      try {
        const { data } = await apiCart.get();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Error al cargar el carrito');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setUpdating(productId);
    try {
      await apiCart.update(productId, quantity);
      await fetchCart(); // Refetch cart to get updated totals from backend
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error al actualizar la cantidad');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setUpdating(productId);
    try {
      await apiCart.remove(productId);
      await fetchCart();
      toast.info('Producto eliminado del carrito');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error al eliminar el producto');
    } finally {
      setUpdating(null);
    }
  };

  // Calcular subtotal y total en el frontend como respaldo
  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, total: 0 };
    
    const subtotal = cart.items.reduce((total: number, item: any) => {
      const itemPrice = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * quantity);
    }, 0);
    
    return {
      subtotal,
      total: subtotal // Envío gratis por ahora
    };
  };

  const { subtotal, total } = calculateTotals();
  
  // Usar el total del backend si está disponible, sino calcularlo
  const displayTotal = cart?.totalAmount !== undefined ? cart.totalAmount : total;
  const displaySubtotal = cart?.totalAmount !== undefined ? cart.totalAmount : subtotal;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando carrito...</p>
      </div>
    </div>
  );

  const cartItems = cart?.items || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingCart size={36} className="text-blue-600" />
          Tu Carrito de Compras
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Tu carrito está vacío</h2>
            <p className="text-gray-500 mt-2 mb-6">Parece que aún no has añadido ningún producto. ¡Explora nuestro catálogo!</p>
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-transform hover:scale-105 inline-block">
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
                {cartItems.length} {cartItems.length === 1 ? 'Producto' : 'Productos'} en tu carrito
              </h2>
              {cartItems.map((item: any) => {
                const itemPrice = parseFloat(item.product?.price) || 0;
                const quantity = parseInt(item.quantity) || 0;
                const itemTotal = itemPrice * quantity;
                
                return (
                  <div key={item.product._id} className="flex flex-col sm:flex-row gap-6 border-b pb-6 last:border-b-0">
                    <img 
                      src={item.product.imageUrl || '/placeholder.jpg'} 
                      alt={item.product.name} 
                      className="w-full sm:w-32 h-32 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <Link 
                        to={`/product/${item.product._id}`} 
                        className="font-bold text-lg text-gray-800 hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <p className="font-semibold text-blue-600 mt-2">S/ {itemPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Subtotal: <span className="font-semibold">S/ {itemTotal.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end justify-between">
                      <div className="flex items-center gap-2 border rounded-full p-1">
                        <button 
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} 
                          disabled={item.quantity <= 1 || updating === item.product._id}
                          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center">
                          {updating === item.product._id ? '...' : item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)} 
                          disabled={updating === item.product._id}
                          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.product._id)} 
                        disabled={updating === item.product._id}
                        className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 mt-4 sm:mt-0 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} /> 
                        {updating === item.product._id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Resumen del Pedido</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})</span>
                    <span className="font-medium">S/ {displaySubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>S/ {displayTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0}
                >
                  Continuar con la Compra
                </button>
                <Link 
                  to="/products" 
                  className="mt-4 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <ArrowLeft size={16} />
                  Seguir Comprando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}