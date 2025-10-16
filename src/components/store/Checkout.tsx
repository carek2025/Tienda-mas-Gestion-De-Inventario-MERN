// src/components/store/Checkout.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cart as apiCart, orders, auth as apiAuth } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Lock, CreditCard, Home, Truck, CheckCircle } from 'lucide-react';

type Step = 'shipping' | 'payment' | 'summary';

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [shippingInfo, setShippingInfo] = useState({ 
    address: '', 
    city: '', 
    postalCode: '' 
  });
  const [paymentInfo, setPaymentInfo] = useState({ 
    paymentMethod: 'card', 
    cardNumber: '', 
    expiryDate: '', 
    cvv: '' 
  });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        // Cargar carrito
        const { data: cartData, error: cartError } = await apiCart.get();
        
        console.log('Cart data:', cartData);
        console.log('Cart error:', cartError);
        
        if (cartError || !cartData || !cartData.items || cartData.items.length === 0) {
          navigate('/cart');
          toast.warn('Tu carrito está vacío.');
          return;
        }
        
        setCart(cartData);

        // Cargar datos del usuario
        if (user) {
          try {
            const { data: userData } = await apiAuth.getUser();
            if (userData) {
              setShippingInfo(prev => ({ 
                ...prev, 
                address: userData.address || '',
              }));
            }
          } catch (e) {
            console.log('No se pudo cargar datos del usuario');
          }
        } else {
          // Si no hay usuario logueado, redirigir o manejar (asumiendo backend requiere auth)
          toast.error('Debes iniciar sesión para completar la compra.');
          navigate('/login');
          return;
        }
      } catch (e) {
        console.error('Error al cargar checkout:', e);
        toast.error('Error al cargar los datos del carrito');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [navigate, user]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.address.trim() || !shippingInfo.city.trim() || !shippingInfo.postalCode.trim()) {
      toast.error('Por favor completa todos los campos de envío');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentInfo.paymentMethod === 'card') {
      if (!paymentInfo.cardNumber.trim() || !paymentInfo.expiryDate.trim() || !paymentInfo.cvv.trim()) {
        toast.error('Por favor completa todos los datos de la tarjeta');
        return;
      }
    }
    
    setCurrentStep('summary');
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total: number, item: any) => {
      const itemPrice = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * quantity);
    }, 0);
  };

  const handleFinalSubmit = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('El carrito está vacío');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    
    try {
      const total = calculateTotal();

      // Calcular items con variables para consistencia
      const orderItems = cart.items.map((item: any) => {
        const quantity = parseInt(item.quantity) || 1;
        const unitPrice = parseFloat(item.product?.price) || 0;
        const subtotal = quantity * unitPrice;
        return {
          productId: item.product?._id,
          quantity,
          unitPrice,
          subtotal,
        };
      });

      const orderData = {
        items: orderItems,
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`,
        paymentMethod: paymentInfo.paymentMethod,
        totalAmount: total,
      };

      console.log('Sending order data:', orderData);

      // Validar que los datos sean válidos (añadido chequeo de NaN en subtotal)
      if (orderData.items.some((item: any) => !item.productId || item.unitPrice <= 0 || item.quantity <= 0 || isNaN(item.subtotal))) {
        toast.error('Error en los datos del carrito. Verifica la información.');
        setIsProcessing(false);
        return;
      }

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Crear la orden
      const { error, data: createdOrder } = await orders.create(orderData);

      console.log('Order response - error:', error);
      console.log('Order response - data:', createdOrder);

      if (error) {
        console.error('Error al crear orden:', error);
        toast.error('No se pudo procesar la compra: ' + (error || 'Error desconocido'));
        setIsProcessing(false);
        return;
      }

      if (!createdOrder) {
        toast.error('No se recibió confirmación de la orden');
        setIsProcessing(false);
        return;
      }

      // Limpiar carrito
      await apiCart.clear();
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Usar ID de la orden creada
      const orderId = createdOrder._id || createdOrder.orderNumber || Math.random().toString(36).substr(2, 9).toUpperCase();
      
      toast.success('¡Compra realizada exitosamente!');
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('Error en checkout:', error);
      toast.error('Error inesperado al procesar la compra');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">El carrito está vacío</p>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Proceso de Pago</h1>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-12">
          <div className={`step ${currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'summary' ? 'active' : ''}`}>
            <Truck className="mb-2" />
            <span>Envío</span>
          </div>
          <div className="flex-1 border-t-2 mx-4"></div>
          <div className={`step ${currentStep === 'payment' || currentStep === 'summary' ? 'active' : ''}`}>
            <CreditCard className="mb-2" />
            <span>Pago</span>
          </div>
          <div className="flex-1 border-t-2 mx-4"></div>
          <div className={`step ${currentStep === 'summary' ? 'active' : ''}`}>
            <CheckCircle className="mb-2" />
            <span>Confirmación</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {currentStep === 'shipping' && (
              <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Home className="text-blue-600" />
                  Dirección de Envío
                </h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <input
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder="Dirección (calle, número)"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                  <div className="flex gap-4">
                    <input
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      placeholder="Ciudad"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                    <input
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      placeholder="Código Postal"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Continuar al Pago
                  </button>
                </form>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <CreditCard className="text-blue-600" />
                  Información de Pago
                </h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <select
                    value={paymentInfo.paymentMethod}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="card">Tarjeta de Crédito/Débito</option>
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                    {/* Nota: Si el backend no soporta 'yape' o 'plin', cambia a opciones de la primera versión como 'cash' o 'transfer' */}
                  </select>

                  {paymentInfo.paymentMethod === 'card' && (
                    <>
                      <input
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        placeholder="Número de Tarjeta (XXXX-XXXX-XXXX-XXXX)"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                        required
                      />
                      <div className="flex gap-4">
                        <input
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          placeholder="Fecha de Expiración (MM/AA)"
                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                          required
                        />
                        <input
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          placeholder="CVV"
                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600"
                          required
                        />
                      </div>
                    </>
                  )}

                  {(paymentInfo.paymentMethod === 'yape' || paymentInfo.paymentMethod === 'plin') && (
                    <div className="text-center p-4 bg-gray-100 rounded-lg">
                      <p className="text-gray-700">Al confirmar, serás redirigido a la aplicación para completar el pago.</p>
                      <p className="font-bold text-lg mt-2 text-blue-600">Número: +51 987 654 321</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Volver a Envío
                    </button>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Revisar Pedido
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'summary' && (
              <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  Confirmar y Pagar
                </h2>
                <div className="space-y-4 border-b pb-4 mb-4">
                  <div>
                    <strong>Dirección de Envío:</strong>
                    <p className="text-gray-600">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}</p>
                  </div>
                  <div>
                    <strong>Método de Pago:</strong>
                    <p className="text-gray-600">
                      {paymentInfo.paymentMethod.charAt(0).toUpperCase() + paymentInfo.paymentMethod.slice(1)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  Al hacer clic en "Confirmar Compra", aceptas nuestros Términos y Condiciones.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Volver a Pago
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    <Lock size={16} />
                    {isProcessing ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Resumen de tu compra</h3>
              <div className="space-y-3 mb-4">
                {cart?.items?.map((item: any) => {
                  const itemPrice = parseFloat(item.product?.price) || 0;
                  const quantity = parseInt(item.quantity) || 0;
                  const subtotal = itemPrice * quantity;
                  
                  return (
                    <div key={item.product?._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {item.product?.name} x {quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        S/ {subtotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 font-bold flex justify-between text-lg text-gray-900">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .step { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          color: #9ca3af;
          gap: 0.5rem;
        }
        .step.active { 
          color: #2563eb; 
          font-weight: 600; 
        }
        .animate-fade-in { 
          animation: fadeIn 0.5s ease-in-out; 
        }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}

export function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-12 rounded-lg shadow-xl max-w-lg">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">¡Compra Realizada con Éxito!</h1>
        <p className="text-gray-600 mb-2">
          Gracias por tu compra en TechStore. Hemos recibido tu pedido y lo estamos procesando.
        </p>
        <p className="font-semibold text-lg text-gray-800 mb-8">
          Número de Orden: <span className="text-blue-600">TS-{id}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/history')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Ver Historial de Compras
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}