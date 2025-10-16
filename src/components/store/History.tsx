// src/components/store/History.tsx - MEJORADO
import { useState, useEffect } from 'react';
import { orders as apiOrders } from '../../lib/api';
import { FileText, Calendar, Package, DollarSign, Clock, Truck, CheckCircle, Star, Gift } from 'lucide-react';

export function History() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    apiOrders.getAll().then(({ data }) => {
      setOrderList(data || []);
      setLoading(false);
    });
  }, []);

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: { 
        color: 'from-green-500 to-emerald-600', 
        icon: <CheckCircle className="w-5 h-5" />,
        text: 'Completado',
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600'
      },
      pending: { 
        color: 'from-yellow-500 to-orange-500', 
        icon: <Clock className="w-5 h-5" />,
        text: 'Pendiente',
        bg: 'bg-gradient-to-r from-yellow-500 to-orange-500'
      },
      cancelled: { 
        color: 'from-red-500 to-pink-600', 
        icon: <FileText className="w-5 h-5" />,
        text: 'Cancelado',
        bg: 'bg-gradient-to-r from-red-500 to-pink-600'
      },
      shipping: { 
        color: 'from-blue-500 to-cyan-600', 
        icon: <Truck className="w-5 h-5" />,
        text: 'En camino',
        bg: 'bg-gradient-to-r from-blue-500 to-cyan-600'
      }
    };
    return configs[status.toLowerCase() as keyof typeof configs] || configs.pending;
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-700 font-semibold">Explorando tu historia mágica...</p>
      </div>
    </div>
  );

  const totalSpent = orderList.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orderList.filter(order => order.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header con estadísticas */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-emerald-500" />
            Tu Viaje de Compras
          </h1>
          
          {orderList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-emerald-600">{orderList.length}</div>
                <div className="text-gray-600">Órdenes Totales</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-teal-600">{completedOrders}</div>
                <div className="text-gray-600">Completadas</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-green-600">S/ {totalSpent.toFixed(2)}</div>
                <div className="text-gray-600">Total Invertido</div>
              </div>
            </div>
          )}
        </div>

        {orderList.length === 0 ? (
          <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
            <div className="relative inline-block mb-6">
              <FileText size={80} className="text-gray-300" />
              <Gift className="absolute -top-2 -right-2 w-8 h-8 text-emerald-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu historia está por comenzar</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Cada compra que realices se convertirá en un capítulo especial de tu viaje con nosotros.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderList.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const orderDate = new Date(order.createdAt);
              const isExpanded = expandedOrder === order._id;
              
              return (
                <div 
                  key={order._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl text-white ${statusConfig.bg}`}>
                          {statusConfig.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            Orden #{order.orderNumber}
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Calendar size={14} />
                            {orderDate.toLocaleDateString('es-PE', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 text-sm font-semibold text-white rounded-full ${statusConfig.bg}`}>
                          {statusConfig.text}
                        </span>
                        <p className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-1">
                          <DollarSign size={20} />
                          {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gradient-to-br from-gray-50 to-white/50 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Products */}
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-700">
                            <Package className="w-5 h-5 text-emerald-600" />
                            Productos Mágicos:
                          </h4>
                          <ul className="space-y-3">
                            {order.items.map((item: any) => (
                              <li 
                                key={item.productId?._id || item._id} 
                                className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={item.productId?.imageUrl || '/placeholder.jpg'} 
                                    alt={item.productId?.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div>
                                    <span className="font-medium text-gray-800">
                                      {item.quantity} x {item.productId?.name || 'Producto mágico'}
                                    </span>
                                    <p className="text-sm text-gray-500">S/ {item.unitPrice?.toFixed(2)} c/u</p>
                                  </div>
                                </div>
                                <span className="font-bold text-emerald-600">S/ {item.subtotal.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h5 className="font-semibold text-gray-700 mb-2">Dirección de Entrega</h5>
                            <p className="text-gray-600">{order.address}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h5 className="font-semibold text-gray-700 mb-2">Método de Pago</h5>
                            <p className="text-gray-600 capitalize">{order.paymentMethod}</p>
                          </div>
                          
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl text-white">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total de la Orden</span>
                              <span className="text-xl font-bold">S/ {order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}