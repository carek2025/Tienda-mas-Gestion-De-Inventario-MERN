import { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { dashboard } from '../../lib/api';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todaySales: number;
  todayRevenue: number;
  activeAlerts: number;
  totalInventoryValue: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    todaySales: 0,
    todayRevenue: 0,
    activeAlerts: 0,
    totalInventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const { data } = await dashboard.getStats();
    if (data) {
      setStats(data);
    }
    setLoading(false);
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Package}
          title="Total de Productos"
          value={stats.totalProducts}
          subtitle="En inventario"
          color="bg-blue-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Ventas de Hoy"
          value={stats.todaySales}
          subtitle={`S/ ${stats.todayRevenue.toFixed(2)}`}
          color="bg-green-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Alertas Activas"
          value={stats.activeAlerts}
          subtitle="Requieren atención"
          color="bg-orange-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Productos con Stock Bajo"
          value={stats.lowStockProducts}
          subtitle="Bajo stock mínimo"
          color="bg-red-600"
        />
        <StatCard
          icon={DollarSign}
          title="Valor del Inventario"
          value={`S/ ${stats.totalInventoryValue.toFixed(2)}`}
          subtitle="Inversión total"
          color="bg-teal-600"
        />
        <StatCard
          icon={BarChart3}
          title="Ingresos de Hoy"
          value={`S/ ${stats.todayRevenue.toFixed(2)}`}
          subtitle="Ventas realizadas"
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Estado del Inventario
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Productos totales</span>
              <span className="font-bold text-blue-600">{stats.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Con stock bajo</span>
              <span className="font-bold text-red-600">{stats.lowStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Con stock óptimo</span>
              <span className="font-bold text-green-600">
                {stats.totalProducts - stats.lowStockProducts}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Resumen de Ventas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Ventas de hoy</span>
              <span className="font-bold text-green-600">{stats.todaySales}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Ingresos de hoy</span>
              <span className="font-bold text-teal-600">
                S/ {stats.todayRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Promedio por venta</span>
              <span className="font-bold text-blue-600">
                S/{' '}
                {stats.todaySales > 0
                  ? (stats.todayRevenue / stats.todaySales).toFixed(2)
                  : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {stats.activeAlerts > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Atención Requerida
              </h3>
              <p className="text-orange-700">
                Hay <strong>{stats.activeAlerts}</strong> alerta
                {stats.activeAlerts !== 1 ? 's' : ''} activa
                {stats.activeAlerts !== 1 ? 's' : ''} que requieren tu atención. Por favor,
                revisa la sección de alertas para tomar acción.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}