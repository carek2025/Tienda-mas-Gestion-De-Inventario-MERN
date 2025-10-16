// src/components/store/History.tsx (new)
import { useState, useEffect } from 'react';
import { orders as apiOrders } from '../../lib/api';

export function History() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiOrders.getAll().then(({ data }) => {
      setOrderList(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Historial de Compras</h1>
      {orderList.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <h3 className="font-bold">Orden #{order.orderNumber}</h3>
          <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Total: S/ {order.totalAmount.toFixed(2)}</p>
          <p>Estado: {order.status}</p>
          <ul className="mt-2">
            {order.items.map((item: any) => (
              <li key={item.productId._id}>{item.quantity} x {item.productId?.name} - S/ {item.subtotal.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      ))}
      {orderList.length === 0 && <p>No tienes compras realizadas.</p>}
    </div>
  );
}