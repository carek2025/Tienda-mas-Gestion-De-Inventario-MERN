// src/components/layout/Footer.tsx (new)
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">TechStore</h3>
          <p className="text-gray-400">Tu tienda en línea de confianza para herramientas, electrohogar y tecnología. Ofrecemos productos de calidad a precios competitivos desde 2010.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400">Inicio</Link></li>
            <li><Link to="/products" className="hover:text-blue-400">Productos</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contacto</Link></li>
            <li><Link to="/favorites" className="hover:text-blue-400">Favoritos</Link></li>
            <li><Link to="/history" className="hover:text-blue-400">Historial</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contacto</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Av. Principal 123, Ciudad Ejemplo</li>
            <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +1 234 567 890</li>
            <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> info@techstore.com</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Síguenos</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400">Facebook</a>
            <a href="#" className="hover:text-blue-400">Instagram</a>
            <a href="#" className="hover:text-blue-400">Twitter</a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        &copy; 2025 TechStore. Todos los derechos reservados.
      </div>
    </footer>
  );
}