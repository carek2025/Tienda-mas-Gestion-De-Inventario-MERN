import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { alerts } from '../../lib/api';

interface Alert {
  _id: string;
  productId: {
    _id: string;
    name: string;
    brand: string;
    stock: number;
    minStock: number;
  };
  alertType: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export function AlertsList() {
  const [alertsList, setAlertsList] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    const { data } = await alerts.getAll(filter);
    if (data) setAlertsList(data);
    setLoading(false);
  };

  const resolveAlert = async (id: string) => {
    await alerts.resolve(id);
    loadAlerts();
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

  const activeAlertsCount = alertsList.filter((a) => !a.isResolved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Alertas de Inventario</h2>
            {filter === 'active' && activeAlertsCount > 0 && (
              <p className="text-sm text-orange-600 font-medium">
                {activeAlertsCount} alerta{activeAlertsCount !== 1 ? 's' : ''} activa
                {activeAlertsCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'resolved'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resueltas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando alertas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alertsList.map((alert) => (
            <div
              key={alert._id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                alert.isResolved
                  ? 'border-green-500'
                  : 'border-orange-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {alert.isResolved ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {alert.productId?.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        ({alert.productId?.brand})
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          alert.isResolved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {alert.isResolved ? 'Resuelta' : 'Activa'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Stock actual: <strong>{alert.productId?.stock}</strong>
                      </span>
                      <span>
                        Stock mínimo: <strong>{alert.productId?.minStock}</strong>
                      </span>
                      <span>Fecha: {formatDate(alert.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {!alert.isResolved && (
                  <button
                    onClick={() => resolveAlert(alert._id)}
                    className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors ml-4"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como resuelta
                  </button>
                )}
              </div>
            </div>
          ))}

          {alertsList.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              {filter === 'active' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No hay alertas activas</p>
                  <p className="text-sm text-gray-500 mt-2">
                    ¡Todo el inventario está en niveles óptimos!
                  </p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay alertas</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}