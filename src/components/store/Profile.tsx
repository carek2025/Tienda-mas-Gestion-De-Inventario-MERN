// src/components/store/Profile.tsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, MapPin, Phone, KeyRound, Save } from 'lucide-react';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    address: user?.address || '',
    phone: user?.phone || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

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
        toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
        setLoading(false);
        return;
      }
      updateData.password = formData.password;
    }

    const { error } = await updateProfile(updateData);
    if (!error) {
      toast.success('¡Perfil actualizado con éxito!');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } else {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
              <User size={64} className="mx-auto text-blue-500 bg-blue-100 p-4 rounded-full mb-4"/>
              <h1 className="text-3xl font-extrabold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-500 mt-2">Actualiza tu información personal y de contacto.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <User className="absolute left-3 top-10 text-gray-400 w-5 h-5"/>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full mt-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
            </div>

             <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <Mail className="absolute left-3 top-10 text-gray-400 w-5 h-5"/>
              <input name="email" value={user?.email || ''} disabled className="w-full mt-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <MapPin className="absolute left-3 top-10 text-gray-400 w-5 h-5"/>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Ej: Av. Principal 123" className="w-full mt-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <Phone className="absolute left-3 top-10 text-gray-400 w-5 h-5"/>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: 987654321" className="w-full mt-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>

             <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Nueva Contraseña (Opcional)</label>
              <KeyRound className="absolute left-3 top-10 text-gray-400 w-5 h-5"/>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" className="w-full mt-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres.</p>
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400">
              <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}