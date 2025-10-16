// src/components/dashboard/SalesList.tsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { sales } from '../../lib/api';
import { SalesForm } from './SalesForm';

interface Sale {
  _id: string;
  saleNumber: string;
  customerName: string;
  customerDocument: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export function SalesList() {
  const [salesList, setSalesList] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    const { data } = await sales.getAll();
    if (data) setSalesList(data);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paymentMethodLabels: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
  };

  const statusLabels: Record<string, { label: string; className: string }> = {
    completed: { label: 'Completado', className: 'bg-green-100 text-green-800' },
    pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Ventas</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all hover:scale-105 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nueva Venta
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ventas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Número', 'Cliente', 'Documento', 'Método de Pago', 'Total', 'Fecha', 'Estado'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesList.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {sale.saleNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{sale.customerName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {sale.customerDocument || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {paymentMethodLabels[sale.paymentMethod]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">
                        S/ {sale.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatDate(sale.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusLabels[sale.status]?.className || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusLabels[sale.status]?.label || sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {salesList.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay ventas registradas</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <SalesForm onClose={() => setShowForm(false)} onSave={loadSales} />
      )}
    </div>
  );
}