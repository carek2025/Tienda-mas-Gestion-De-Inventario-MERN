// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, AtSign, KeyRound, User as UserIcon, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'staff'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);

    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
      <Link to="/" className="text-3xl font-bold text-center block mb-2 text-blue-600 transition-colors hover:text-blue-700">
        TechStore
      </Link>
      <div className="flex items-center justify-center mb-6">
        <UserPlus className="w-10 h-10 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crea tu Cuenta</h2>

       {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
          <p className="font-bold">Error de Registro</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
           <div className="relative">
             <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Juan Pérez"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
           <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
           <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres de longitud.</p>
        </div>
        
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
           <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'customer' | 'staff')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition"
            >
              <option value="customer">Cliente</option>
              <option value="staff">Personal (Staff)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}