// src/components/store/Cart.tsx - MEJORADO
import { useState, useEffect } from 'react';
import { cart as apiCart } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Sparkles, Gift, Rocket, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

export function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [pulseAnimation, setPulseAnimation] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const fetchCart = async () => {
    if (user) {
      try {
        const { data } = await apiCart.get();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('❌ Error al cargar el carrito ');
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
    setPulseAnimation(productId);
    try {
      await apiCart.update(productId, quantity);
      await fetchCart();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setTimeout(() => setPulseAnimation(null), 500);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('💫 Error al actualizar la cantidad');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setUpdating(productId);
    try {
      await apiCart.remove(productId);
      await fetchCart();
      toast.info('🗑️ Producto eliminado del carrito');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('⚡ Error al eliminar el producto');
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, total: 0 };
    
    const subtotal = cart.items.reduce((total: number, item: any) => {
      const itemPrice = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * quantity);
    }, 0);
    
    return {
      subtotal,
      total: subtotal
    };
  };

  const { subtotal, total } = calculateTotals();
  const displayTotal = cart?.totalAmount !== undefined ? cart.totalAmount : total;
  const displaySubtotal = cart?.totalAmount !== undefined ? cart.totalAmount : subtotal;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce mb-4">
          <ShoppingCart className="w-16 h-16 text-orange-500 mx-auto" />
        </div>
        <p className="text-orange-700 font-semibold">Preparando tu carrito ...</p>
      </div>
    </div>
  );

  const cartItems = cart?.items || [];
  const itemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header  */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-6 left-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-10 right-1/3 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <ShoppingCart className="w-10 h-10 text-orange-500" />
            Tu Carrito 
          </h1>
          <p className="text-lg text-gray-600">
            {cartItems.length > 0 
              ? `✨ ${itemCount} productos listos para la aventura` 
              : 'Tu carrito está esperando productos '
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
            <div className="relative inline-block mb-6">
              <ShoppingCart size={80} className="text-gray-300 mx-auto" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Tu carrito está vacío!</h2>
            <p className="text-gray-500 mb-6">Los productos  están esperando para unirse a tu aventura.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5" />
              Explorar Productos Encantados
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Productos del Carrito */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4 flex items-center gap-3">
                  <Gift className="w-6 h-6 text-orange-500" />
                  {cartItems.length} {cartItems.length === 1 ? 'Tesoro' : 'Tesoros'} en tu Carrito
                </h2>
                
                <div className="space-y-6 mt-6">
                  {cartItems.map((item: any) => {
                    const itemPrice = parseFloat(item.product?.price) || 0;
                    const quantity = parseInt(item.quantity) || 0;
                    const itemTotal = itemPrice * quantity;
                    const isUpdating = updating === item.product._id;
                    const isPulsing = pulseAnimation === item.product._id;
                    
                    return (
                      <div 
                        key={item.product._id} 
                        className={`flex flex-col sm:flex-row gap-6 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 ${
                          isPulsing ? 'animate-pulse ring-2 ring-orange-400' : ''
                        }`}
                      >
                        <img 
                          src={item.product.imageUrl || '/placeholder.jpg'} 
                          alt={item.product.name} 
                          className="w-full sm:w-24 h-24 object-cover rounded-lg shadow-lg"
                        />
                        
                        <div className="flex-1">
                          <Link 
                            to={`/product/${item.product._id}`} 
                            className="font-bold text-lg text-gray-800 hover:text-orange-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500">{item.product.brand}</p>
                          <p className="font-semibold text-orange-600 mt-2 text-lg">
                            S/ {itemPrice.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Subtotal: <span className="font-semibold text-green-600">S/ {itemTotal.toFixed(2)}</span>
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end justify-between">
                          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                            <button 
                              onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} 
                              disabled={item.quantity <= 1 || isUpdating}
                              className="p-2 rounded-full hover:bg-orange-50 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold w-8 text-center text-gray-800">
                              {isUpdating ? '✨' : item.quantity}
                            </span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)} 
                              disabled={isUpdating}
                              className="p-2 rounded-full hover:bg-orange-50 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => handleRemove(item.product._id)} 
                            disabled={isUpdating}
                            className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2 mt-4 sm:mt-0 transition-all duration-200 hover:scale-110 disabled:opacity-50"
                          >
                            <Trash2 size={18} /> 
                            {isUpdating ? 'Desvaneciendo...' : 'Eliminar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">🎁 ¡Envío Gratis!</h3>
                    <p className="text-purple-100">En compras mayores a S/ 200</p>
                  </div>
                  <Rocket className="w-12 h-12 text-yellow-300" />
                </div>
              </div>
            </div>

            {/* Resumen del Pedido */}
            <aside className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 sticky top-28">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                  Resumen 
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
                    <span className="font-semibold text-lg">S/ {displaySubtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-600 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span>Envío </span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Gratis
                    </span>
                  </div>
                  
                  {displaySubtotal < 200 && (
                    <div className="text-center text-sm text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-200">
                      ✨ ¡Faltan S/ {(200 - displaySubtotal).toFixed(2)} para envío gratis!
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center font-bold text-xl">
                    <span className="text-gray-800">Total </span>
                    <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      S/ {displayTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Rocket className="w-5 h-5" />
                  Iniciar Aventura de Compra
                </button>
                
                <Link 
                  to="/products" 
                  className="mt-4 flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-all duration-200 hover:gap-3"
                >
                  <ArrowLeft size={18} />
                  Continuar Explorando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}