// src/components/layout/Sidebar.tsx - MEJORADO
import { BarChart3, Package, ShoppingCart, AlertTriangle, LogOut, ArrowLeft, Sparkles, Zap, Crown, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard Mágico', 
      icon: BarChart3,
      description: 'Estadísticas y métricas',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: 'products', 
      label: 'Productos Encantados', 
      icon: Package,
      description: 'Gestión de inventario',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'sales', 
      label: 'Ventas Brillantes', 
      icon: ShoppingCart,
      description: 'Historial y reportes',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'alerts', 
      label: 'Alertas Mágicas', 
      icon: AlertTriangle,
      description: 'Notificaciones importantes',
      color: 'from-orange-500 to-red-600'
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white w-80 min-h-screen p-6 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-16 h-16 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-8 w-12 h-12 bg-blue-500 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-pink-500 rounded-full blur-md"></div>
      </div>

      {/* Header */}
      <div className="mb-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-2xl">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TechStore Pro
            </h1>
            <p className="text-sm text-gray-400 flex items-center gap-1 justify-center">
              <Sparkles className="w-3 h-3" />
              Sistema de Gestión Mágica
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Conectado
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 relative z-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-500 group ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-2xl transform scale-105`
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">{item.label}</div>
                  <div className={`text-xs transition-all duration-300 ${
                    isActive ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="space-y-3 relative z-10 mt-8">
        {/* Back to Store */}
        <Link
          to="/"
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group"
        >
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold">Volver a la Tienda</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">
              Regresar al modo cliente
            </div>
          </div>
        </Link>

        {/* Settings */}
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group">
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold">Configuración</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">
              Ajustes del sistema
            </div>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-pink-600/20 text-red-300 hover:from-red-500/30 hover:to-pink-600/30 hover:text-white transition-all duration-300 group border border-red-500/20 hover:border-red-500/40"
        >
          <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold">Cerrar Sesión</div>
            <div className="text-xs text-red-400 group-hover:text-red-300">
              Salir del modo administrador
            </div>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="mt-6 pt-4 border-t border-white/10 text-center relative z-10">
        <div className="text-xs text-gray-400 space-y-1">
          <div>Versión 2.1.0</div>
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Modo Info Activado</span>
          </div>
        </div>
      </div>
    </div>
  );
}