// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/products' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Contacto', path: '/contact' },
    { name: 'Políticas de Privacidad', path: '/privacy' },
  ];

  const customerServiceLinks = [
    { name: 'Mi Cuenta', path: '/profile' },
    { name: 'Mis Favoritos', path: '/favorites' },
    { name: 'Historial de Compras', path: '/history' },
    { name: 'Preguntas Frecuentes', path: '/faq' },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">TechStore</h3>
            <p className="text-gray-400">Tu tienda de confianza para el hogar y la construcción. Calidad, variedad y los mejores precios desde 2010.</p>
            <div className="flex items-center gap-4 text-green-400">
              <ShieldCheck size={20} />
              <span>Compra 100% Segura</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 tracking-wider">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-blue-400 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 tracking-wider">Atención al Cliente</h3>
            <ul className="space-y-2">
              {customerServiceLinks.map(link => (
                 <li key={link.name}>
                  <Link to={link.path} className="hover:text-blue-400 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 tracking-wider">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" /> 
                <span>Av. Principal 123, Huánuco, Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>soporte@techstore.com.pe</span>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><Facebook /></a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><Instagram /></a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><Twitter /></a>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} TechStore. Todos los derechos reservados.</p>
          <p className="text-sm mt-1">Diseñado y desarrollado con ❤️ por el equipo de TechStore.</p>
        </div>
      </div>
    </footer>
  );
}