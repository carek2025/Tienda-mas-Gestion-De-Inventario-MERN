// components/ecommerce/OrderHistory.tsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrderHistoryProps {
  onBack: () => void;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      brand: string;
      imageUrl: string;
    };
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    district: string;
    phone: string;
  };
}

export function OrderHistory({ onBack }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Simular carga de órdenes
    setTimeout(() => {
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          totalAmount: 245.50,
          status: 'delivered',
          createdAt: '2024-01-15T10:30:00Z',
          items: [
            {
              product: {
                _id: '1',
                name: 'Taladro Percutor Profesional',
                brand: 'Bosch',
                imageUrl: ''
              },
              quantity: 1,
              unitPrice: 245.50
            }
          ],
          shippingAddress: {
            firstName: 'Juan',
            lastName: 'Pérez',
            address: 'Av. Principal 123',
            city: 'Lima',
            district: 'Miraflores',
            phone: '999888777'
          }
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          totalAmount: 189.99,
          status: 'shipped',
          createdAt: '2024-01-10T14:20:00Z',
          items: [
            {
              product: {
                _id: '2',
                name: 'Juego de Destornilladores',
                brand: 'Stanley',
                imageUrl: ''
              },
              quantity: 1,
              unitPrice: 89.99
            },
            {
              product: {
                _id: '3',
                name: 'Martillo de Carpintero',
                brand: 'Truper',
                imageUrl: ''
              },
              quantity: 1,
              unitPrice: 100.00
            }
          ],
          shippingAddress: {
            firstName: 'Juan',
            lastName: 'Pérez',
            address: 'Av. Principal 123',
            city: 'Lima',
            district: 'Miraflores',
            phone: '999888777'
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente', icon: Package },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'Procesando', icon: Package },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Enviado', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Entregado', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelado', icon: XCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historial de pedidos...</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al historial
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Detalle del Pedido</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Encabezado del pedido */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedOrder.orderNumber}</h2>
              <p className="text-gray-600">Realizado el {formatDate(selectedOrder.createdAt)}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              {(() => {
                const statusInfo = getStatusInfo(selectedOrder.status);
                const Icon = statusInfo.icon;
                return (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    <Icon className="w-4 h-4" />
                    {statusInfo.text}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Dirección de Envío</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
              </p>
              <p>{selectedOrder.shippingAddress.address}</p>
              <p>
                {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
              </p>
              <p>Teléfono: {selectedOrder.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Productos</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-400">📦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-600 text-sm">{item.product.brand}</p>
                    <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">S/ {item.unitPrice.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">S/ {(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del pago */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Resumen del Pago</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>S/ {selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>S/ {selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la tienda
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay pedidos</h2>
          <p className="text-gray-600 mb-6">Aún no has realizado ningún pedido.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comenzar a comprar
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                      <p className="text-gray-600 text-sm">
                        Realizado el {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Productos</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                              {item.product.imageUrl ? (
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="text-gray-400 text-xs">📦</div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {item.product.name} x{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 2} producto(s) más
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Dirección de Envío</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.district}, {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-lg font-bold text-green-600">
                      S/ {order.totalAmount.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ver Detalle
                      </button>
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Volver a Comprar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}