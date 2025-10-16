// src/components/layout/Footer.tsx - MEJORADO
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ShieldCheck, Heart, Rocket, Zap, Sparkles } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: '🏠 Inicio', path: '/' },
    { name: '🛍️ Productos', path: '/products' },
    { name: '🌟 Sobre Nosotros', path: '/about' },
    { name: '📞 Contacto', path: '/contact' },
    { name: '🔒 Políticas de Privacidad', path: '/privacy' },
  ];

  const customerServiceLinks = [
    { name: '👤 Mi Cuenta', path: '/profile' },
    { name: '❤️ Mis Favoritos', path: '/favorites' },
    { name: '📊 Historial de Compras', path: '/history' },
    { name: '❓ Preguntas Frecuentes', path: '/faq' },
    { name: '📦 Seguimiento de Pedidos', path: '/tracking' },
  ];

  const features = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: 'Compra 100% Segura' },
    { icon: <Rocket className="w-5 h-5" />, text: 'Envío Express' },
    { icon: <Zap className="w-5 h-5" />, text: 'Soporte 24/7' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'Productos' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-pink-500 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-12 text-center shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-3">✨ Únete a la Comunidad</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Suscríbete y recibe ofertas exclusivas, novedades y descuentos especiales en tu correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="tu.correo@electronico.com" 
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg">
              🎉 Suscribirse
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">TechStore</h3>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Tu tienda para el hogar y la construcción. Transformamos espacios con productos de calidad, 
              servicio excepcional y precios que encantan desde 2010.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="text-purple-400">
                    {feature.icon}
                  </div>
                  <span className="text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 tracking-wider flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Enlaces
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-purple-400 transition-all duration-300 hover:translate-x-2 hover:underline flex items-center gap-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 tracking-wider flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Atención
            </h3>
            <ul className="space-y-3">
              {customerServiceLinks.map(link => (
                 <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-purple-400 transition-all duration-300 hover:translate-x-2 hover:underline flex items-center gap-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 tracking-wider flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" /> 
                <span className="group-hover:text-purple-400 transition-colors">
                  Av. Principal 123, Huánuco, Perú
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-green-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-green-400 transition-colors">
                  +51 987 654 321
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-yellow-400 transition-colors">
                  soporte@techstore.com.pe
                </span>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Síguenos en la Redes Sociales</h3>
              <div className="flex gap-4">
                {[
                  { icon: <Facebook className="w-6 h-6" />, label: 'Facebook', color: 'hover:text-blue-400' },
                  { icon: <Instagram className="w-6 h-6" />, label: 'Instagram', color: 'hover:text-pink-400' },
                  { icon: <Twitter className="w-6 h-6" />, label: 'Twitter', color: 'hover:text-cyan-400' },
                ].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    aria-label={social.label}
                    className={`text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2 rounded-xl hover:bg-white/10`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <h4 className="text-lg font-semibold text-white mb-4">Métodos de Pagos</h4>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {['💳', '📱', '🏦', '🔗', '💎'].map((emoji, index) => (
              <div key={index} className="text-2xl hover:scale-110 transition-transform duration-300">
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} TechStore. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span>Diseñado y desarrollado con</span>
              <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span>por el equipo de TechStore</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}