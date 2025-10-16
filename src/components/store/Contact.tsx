// src/components/store/Contact.tsx - MEJORADO
import { MapPin, Phone, Mail, Send, MessageCircle, Clock, Users, Award } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("🎉 ¡Mensaje enviado! Te contactaremos pronto.");
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '10,000+', label: 'Clientes Felices' },
    { icon: <Award className="w-6 h-6" />, value: '15+', label: 'Años de Experiencia' },
    { icon: <MessageCircle className="w-6 h-6" />, value: '24/7', label: 'Soporte' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-xl"></div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Conectemos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para transformar tus ideas en realidad. ¡Hablemos sobre tu próximo proyecto!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-cyan-600 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="w-8 h-8 text-cyan-600" />
              <h2 className="text-3xl font-bold text-gray-800">Envíanos un Mensaje Estelar</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo" 
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/50"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu.correo@ejemplo.com" 
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/50"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">Asunto</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ej: Consulta sobre un producto mágico" 
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/50"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Mensaje</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre tus sueños y proyectos..." 
                  className="w-full border border-gray-300 p-4 rounded-xl h-32 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/50 resize-none"
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Send size={20} />
                {isSubmitting ? 'Enviando Mensaje...' : 'Enviar Mensaje Estelar'}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-cyan-600" />
                Nuestra Ubicación Mágica
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors">
                  <MapPin className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Tienda Principal</h3>
                    <p className="text-gray-600">Av. Principal 123, Amarilis, Huánuco, Perú</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Línea Directa</h3>
                    <p className="text-gray-600">+51 987 654 321</p>
                    <p className="text-sm text-gray-500">Disponible 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
                  <Mail className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Correo Mágico</h3>
                    <p className="text-gray-600">soporte@techstore.com.pe</p>
                    <p className="text-sm text-gray-500">Respondemos en 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <Clock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Horario de Atención</h3>
                    <p className="text-gray-600">Lun - Vie: 8:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sáb - Dom: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 h-64">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15743.76567527123!2d-76.2483556094602!3d-9.927237841584988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91a7c3c2e7b9b139%3A0x9cb133e6f6aa7a7!2sHu%C3%A1nuco%2C%20Peru!5e0!3m2!1sen!2sus!4v1672532585432!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1.5rem' }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Mágica de TechStore"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}