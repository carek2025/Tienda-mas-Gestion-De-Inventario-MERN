// src/components/store/Profile.tsx (new)
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
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
    const { error } = await updateProfile(formData);
    if (!error) {
      toast.success('Perfil actualizado');
    } else {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nombre Completo" className="w-full border p-2 rounded" />
        <input name="email" value={formData.email} disabled className="w-full border p-2 rounded bg-gray-100" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" className="w-full border p-2 rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="w-full border p-2 rounded" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Nueva Contraseña (opcional)" className="w-full border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
      </form>
    </div>
  );
}