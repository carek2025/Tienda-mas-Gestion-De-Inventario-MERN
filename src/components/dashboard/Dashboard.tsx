// src/components/dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  BarChart3,
  Store,
  Globe,
} from 'lucide-react';
import { dashboard } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todaySales: number;
  todayRevenue: number;
  todayPhysicalSales: number;
  todayOnlineSales: number;
  todayPhysicalRevenue: number;
  todayOnlineRevenue: number;
  activeAlerts: number;
  totalInventoryValue: number;
  salesData?: Array<{ 
    date: string; 
    revenue: number;
    physicalRevenue: number;
    onlineRevenue: number;
    physicalSales: number;
    onlineSales: number;
    totalSales: number;
  }>;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  colorClass,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass: string;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
    <div className={`p-3 rounded-full inline-block mb-4 ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    todaySales: 0,
    todayRevenue: 0,
    todayPhysicalSales: 0,
    todayOnlineSales: 0,
    todayPhysicalRevenue: 0,
    todayOnlineRevenue: 0,
    activeAlerts: 0,
    totalInventoryValue: 0,
    salesData: [],
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <button
          onClick={loadDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Actualizar
        </button>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Ingresos Totales Hoy"
          value={`S/ ${stats.todayRevenue.toFixed(2)}`}
          subtitle={`${stats.todaySales} ventas totales`}
          colorClass="bg-green-500"
        />
        <StatCard
          icon={Package}
          title="Total de Productos"
          value={stats.totalProducts}
          subtitle={`${stats.lowStockProducts} con stock bajo`}
          colorClass="bg-blue-500"
        />
        <StatCard
          icon={AlertTriangle}
          title="Alertas Activas"
          value={stats.activeAlerts}
          subtitle="Requieren atención"
          colorClass="bg-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Valor del Inventario"
          value={`S/ ${stats.totalInventoryValue.toFixed(2)}`}
          subtitle="Inversión total"
          colorClass="bg-teal-500"
        />
      </div>

      {/* Desglose de Ventas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Store}
          title="Ventas Físicas"
          value={stats.todayPhysicalSales}
          subtitle={`S/ ${stats.todayPhysicalRevenue.toFixed(2)}`}
          colorClass="bg-purple-500"
        />
        <StatCard
          icon={Globe}
          title="Ventas Online"
          value={stats.todayOnlineSales}
          subtitle={`S/ ${stats.todayOnlineRevenue.toFixed(2)}`}
          colorClass="bg-indigo-500"
        />
        <StatCard
          icon={ShoppingCart}
          title="Ventas Totales"
          value={stats.todaySales}
          subtitle={`S/ ${stats.todayRevenue.toFixed(2)}`}
          colorClass="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Gráfico de Ventas */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ventas de la Última Semana
          </h3>
          {stats.salesData && stats.salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name.includes('revenue') || name.includes('Revenue')) {
                      return [`S/ ${value.toFixed(2)}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="physicalRevenue" fill="#8b5cf6" name="Ventas Físicas" />
                <Bar dataKey="onlineRevenue" fill="#6366f1" name="Ventas Online" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay datos de ventas disponibles
            </div>
          )}
        </div>

        {/* Estado del Inventario */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
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
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Valor del inventario</span>
              <span className="font-bold text-teal-600">
                S/ {stats.totalInventoryValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Resumen de Ventas de Hoy
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Ventas físicas</span>
              <div className="text-right">
                <span className="font-bold text-purple-600 block">{stats.todayPhysicalSales}</span>
                <span className="text-sm text-purple-500">S/ {stats.todayPhysicalRevenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <span className="text-gray-700">Ventas online</span>
              <div className="text-right">
                <span className="font-bold text-indigo-600 block">{stats.todayOnlineSales}</span>
                <span className="text-sm text-indigo-500">S/ {stats.todayOnlineRevenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <span className="text-gray-700 font-semibold">Total ventas</span>
              <div className="text-right">
                <span className="font-bold text-green-600 block text-lg">{stats.todaySales}</span>
                <span className="text-sm text-green-500 font-semibold">S/ {stats.todayRevenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Promedio por venta</span>
              <span className="font-bold text-blue-600">
                S/ {stats.todaySales > 0 ? (stats.todayRevenue / stats.todaySales).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Tendencias de Ventas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tendencias de Ventas
          </h3>
          {stats.salesData && stats.salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Ingresos']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Ingresos Totales"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay datos de tendencias disponibles
            </div>
          )}
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