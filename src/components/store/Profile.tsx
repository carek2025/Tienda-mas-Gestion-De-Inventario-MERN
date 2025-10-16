// src/components/store/Profile.tsx - MEJORADO
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, MapPin, Phone, KeyRound, Save, Shield, Award, Star, Package } from 'lucide-react';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    address: user?.address || '',
    phone: user?.phone || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData: any = {
      fullName: formData.fullName,
      address: formData.address,
      phone: formData.phone,
    };

    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error("🔐 La nueva contraseña debe tener al menos 6 caracteres.");
        setLoading(false);
        return;
      }
      updateData.password = formData.password;
    }

    const { error } = await updateProfile(updateData);
    if (!error) {
      toast.success('🎉 ¡Perfil actualizado!');
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      toast.error(`⚡ ${error}`);
    }
    setLoading(false);
  };

  const stats = [
    { icon: <Package className="w-5 h-5" />, label: 'Órdenes', value: '12', color: 'from-blue-500 to-cyan-600' },
    { icon: <Star className="w-5 h-5" />, label: 'Reseñas', value: '8', color: 'from-yellow-500 to-orange-500' },
    { icon: <Award className="w-5 h-5" />, label: 'Puntos', value: '1,240', color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-28">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-bold text-gray-800 text-lg">{user?.fullName}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <div className="mt-2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    ⭐ Mago Nivel 3
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-r ${stat.color} text-white p-3 rounded-xl text-center`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {stat.icon}
                      <div>
                        <div className="font-bold text-lg">{stat.value}</div>
                        <div className="text-xs opacity-90">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'personal', label: '👤 Información Personal', icon: <User size={18} /> },
                  { id: 'security', label: '🔐 Seguridad', icon: <Shield size={18} /> },
                  { id: 'preferences', label: '⚙️ Preferencias', icon: <Award size={18} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                      activeTab === item.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <h1 className="text-3xl font-bold">Tu Perfil</h1>
                <p className="text-purple-100 mt-2">Gestiona tu información y preferencias</p>
              </div>

              {/* Content */}
              <div className="p-8">
                {activeTab === 'personal' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-purple-600" />
                      Información Personal
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Nombre Completo</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                            <input 
                              name="fullName" 
                              value={formData.fullName} 
                              onChange={handleChange} 
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50" 
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                            <input 
                              name="email" 
                              value={user?.email || ''} 
                              disabled 
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Dirección</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                            <input 
                              name="address" 
                              value={formData.address} 
                              onChange={handleChange} 
                              placeholder="Ej: Calle de la Magia 123" 
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                            <input 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleChange} 
                              placeholder="Ej: 987654321" 
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50" 
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        <Save size={20} />
                        {loading ? 'Guardando Magia...' : 'Guardar Cambios'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-purple-600" />
                      Seguridad y Contraseña
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-3">🔒 Actualizar Contraseña</h3>
                        <p className="text-blue-700 text-sm mb-4">
                          Crea una contraseña nueva y poderosa para proteger tu cuenta.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Nueva Contraseña</label>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                              <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Crea una contraseña poderosa" 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50" 
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              💫 Mínimo 6 caracteres. Recomendamos usar números, letras y símbolos.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3">✅ Estado de Seguridad</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Contraseña</span>
                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              Fuerte
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Verificación en 2 pasos</span>
                            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              Recomendado
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Actividad reciente</span>
                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              Segura
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        <Shield size={20} />
                        {loading ? 'Actualizando Seguridad...' : 'Actualizar Seguridad'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Award className="w-6 h-6 text-purple-600" />
                      Preferencias
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                          <h3 className="font-semibold text-purple-800 mb-3">🎨 Tema de la Interfaz</h3>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="radio" name="theme" className="text-purple-600" defaultChecked />
                              <span className="text-gray-700">Modo Claro (Recomendado)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="radio" name="theme" className="text-purple-600" />
                              <span className="text-gray-700">Modo Oscuro</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="radio" name="theme" className="text-purple-600" />
                              <span className="text-gray-700">Automático (Sistema)</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                          <h3 className="font-semibold text-orange-800 mb-3">🔔 Notificaciones</h3>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="rounded text-orange-600" defaultChecked />
                              <span className="text-gray-700">Ofertas y promociones</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="rounded text-orange-600" defaultChecked />
                              <span className="text-gray-700">Estado de pedidos</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="rounded text-orange-600" />
                              <span className="text-gray-700">Newsletter semanal</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                          <h3 className="font-semibold text-green-800 mb-3">🌎 Idioma y Región</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
                              <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option>Español (Perú)</option>
                                <option>English</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
                              <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option>Soles (PEN)</option>
                                <option>Dólares (USD)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                          <h3 className="font-semibold text-blue-800 mb-3">📊 Privacidad</h3>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                              <span className="text-gray-700">Compartir datos anónimos</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="rounded text-blue-600" />
                              <span className="text-gray-700">Mostrar perfil público</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                              <span className="text-gray-700">Permitir recomendaciones</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                      <Save size={20} />
                      Guardar Preferencias
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}