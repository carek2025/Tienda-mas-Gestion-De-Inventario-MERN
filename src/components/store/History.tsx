// src/components/store/History.tsx
import { useState, useEffect } from 'react';
import { orders as apiOrders } from '../../lib/api';
import { FileText, Calendar, Tag, Hash, Package, DollarSign } from 'lucide-react';

export function History() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiOrders.getAll().then(({ data }) => {
      setOrderList(data || []);
      setLoading(false);
    });
  }, []);

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-20">Cargando tu historial...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <FileText size={36} className="text-blue-600"/>
          Historial de Compras
        </h1>

        {orderList.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">No tienes compras realizadas</h2>
            <p className="text-gray-500 mt-2">Todas tus compras aparecerán aquí una vez que las realices.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderList.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <Hash size={18} /> Orden #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChip(order.status)}`}>
                        {order.status === 'completed' ? 'Completado' : order.status}
                     </span>
                     <p className="font-bold text-xl text-blue-600 flex items-center gap-1">
                       <DollarSign size={20} />
                       {order.totalAmount.toFixed(2)}
                     </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700"><Package size={18} />Productos:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item: any) => (
                      <li key={item.productId?._id || item._id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <span>{item.quantity} x {item.productId?.name || 'Producto no disponible'}</span>
                        <span className="font-medium">S/ {item.subtotal.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}