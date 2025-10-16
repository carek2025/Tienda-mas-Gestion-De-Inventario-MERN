// src/components/dashboard/Dashboard.tsx - VERSIÓN PROFESIONAL
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
  RefreshCw,
  Users,
  CreditCard,
  Calendar,
  Filter
} from 'lucide-react';
import { dashboard, products as productsApi } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

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

interface CategoryData {
  name: string;
  value: number;
  count: number;
  color: string;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color,
  delay
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  color: string;
  delay: number;
}) => (
  <div 
    className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 group hover:shadow-xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend >= 0 ? '' : 'rotate-180'}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <h3 className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">
        {value}
      </p>
      {subtitle && (
        <p className="text-gray-500 text-sm">{subtitle}</p>
      )}
    </div>
  </div>
);

const ChartContainer = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl p-6 border border-gray-200 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
      <BarChart3 className="w-5 h-5 text-blue-600" />
      {title}
    </h3>
    {children}
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
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setRefreshing(true);
    
    try {
      const [dashboardRes, productsRes] = await Promise.all([
        dashboard.getStats(),
        productsApi.getAll()
      ]);

      if (dashboardRes.data) {
        setStats(dashboardRes.data);
      }

      // Calcular distribución real de categorías
      if (productsRes.data) {
        const categoryCount: { [key: string]: number } = {};
        productsRes.data.forEach((product: any) => {
          const categoryName = product.categoryId?.name || 'Sin Categoría';
          categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
        });

        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
        const totalProducts = productsRes.data.length;
        
        const formattedData = Object.entries(categoryCount).map(([name, count], index) => ({
          name,
          value: Math.round((count / totalProducts) * 100),
          count,
          color: colors[index % colors.length]
        }));

        setCategoryData(formattedData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Datos reales para gráficos basados en stats
  const performanceData = stats.salesData?.map(day => ({
    name: day.date,
    ventas: day.totalSales,
    ingresos: day.revenue
  })) || [];

  const salesComparisonData = [
    { name: 'Físicas', ventas: stats.todayPhysicalSales, ingresos: stats.todayPhysicalRevenue },
    { name: 'Online', ventas: stats.todayOnlineSales, ingresos: stats.todayOnlineRevenue }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Panel de Control
          </h1>
          <p className="text-gray-600">
            Resumen ejecutivo y métricas de rendimiento
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
          </select>
          
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title="Ingresos Hoy"
          value={`S/ ${stats.todayRevenue.toFixed(2)}`}
          subtitle={`${stats.todaySales} transacciones`}
          trend={12.5}
          color="bg-green-500"
          delay={0}
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Ventas"
          value={stats.todaySales}
          subtitle={`${stats.todayPhysicalSales} físico + ${stats.todayOnlineSales} online`}
          trend={8.2}
          color="bg-blue-500"
          delay={100}
        />
        <StatCard
          icon={Package}
          title="Productos"
          value={stats.totalProducts}
          subtitle={`${stats.lowStockProducts} con stock bajo`}
          trend={-5.3}
          color="bg-orange-500"
          delay={200}
        />
        <StatCard
          icon={AlertTriangle}
          title="Alertas"
          value={stats.activeAlerts}
          subtitle="Requieren atención"
          trend={15.7}
          color="bg-red-500"
          delay={300}
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Store}
          title="Ventas Físicas"
          value={stats.todayPhysicalSales}
          subtitle={`S/ ${stats.todayPhysicalRevenue.toFixed(2)}`}
          trend={6.8}
          color="bg-purple-500"
          delay={0}
        />
        <StatCard
          icon={Globe}
          title="Ventas Online"
          value={stats.todayOnlineSales}
          subtitle={`S/ ${stats.todayOnlineRevenue.toFixed(2)}`}
          trend={22.4}
          color="bg-cyan-500"
          delay={100}
        />
        <StatCard
          icon={CreditCard}
          title="Ticket Promedio"
          value={`S/ ${stats.todaySales > 0 ? (stats.todayRevenue / stats.todaySales).toFixed(2) : '0.00'}`}
          subtitle="Por transacción"
          trend={18.9}
          color="bg-teal-500"
          delay={200}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <ChartContainer title="Tendencia de Ingresos" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Ingresos']}
              />
              <Area 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Category Distribution */}
        <ChartContainer title="Distribución por Categoría">
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Category Legend */}
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-gray-600">
                    {category.count} productos ({category.value}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Comparison */}
        <ChartContainer title="Comparación de Ventas">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'ingresos') {
                    return [`S/ ${value.toFixed(2)}`, 'Ingresos'];
                  }
                  return [value, 'Ventas'];
                }}
              />
              <Legend />
              <Bar dataKey="ventas" fill="#3B82F6" name="Cantidad de Ventas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ingresos" fill="#10B981" name="Ingresos (S/)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Inventory Status */}
        <ChartContainer title="Estado del Inventario">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{stats.totalProducts}</div>
                <div className="text-blue-600 text-sm">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {stats.totalProducts - stats.lowStockProducts}
                </div>
                <div className="text-green-600 text-sm">Stock Bueno</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{stats.lowStockProducts}</div>
                <div className="text-red-600 text-sm">Stock Bajo</div>
              </div>
            </div>
            
            {/* Inventory Value */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Valor Total del Inventario</span>
                <span className="text-lg font-bold text-gray-900">
                  S/ {stats.totalInventoryValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stock Health */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estado General del Stock</span>
                <span>{Math.round(((stats.totalProducts - stats.lowStockProducts) / stats.totalProducts) * 100)}% Óptimo</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((stats.totalProducts - stats.lowStockProducts) / stats.totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Alert Section */}
      {stats.activeAlerts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Alertas Activas - Atención Requerida
              </h3>
              <p className="text-red-700">
                Existen <strong>{stats.activeAlerts}</strong> alerta
                {stats.activeAlerts !== 1 ? 's' : ''} que requieren revisión inmediata. 
                <span className="block mt-1 text-red-600">
                  Productos con stock crítico que necesitan reabastecimiento.
                </span>
              </p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Gestionar Alertas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}