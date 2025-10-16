// src/components/store/Contact.tsx
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert("Mensaje enviado (simulación). ¡Gracias por contactarnos!");
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Contáctanos</h1>
          <p className="mt-4 text-xl text-gray-600">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" id="name" placeholder="Tu nombre completo" className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input type="email" id="email" placeholder="tu.correo@ejemplo.com" className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
                <input type="text" id="subject" placeholder="Ej: Consulta sobre un producto" className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea id="message" placeholder="Escribe tu mensaje aquí..." className="mt-1 w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Send size={18} /> Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Nuestra Tienda</h3>
                    <p className="text-gray-600">Av. Principal 123, Amarilis, Huánuco, Perú</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Llámanos</h3>
                    <p className="text-gray-600">+51 987 654 321</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                   <div>
                    <h3 className="font-semibold text-gray-800">Escríbenos</h3>
                    <p className="text-gray-600">soporte@techstore.com.pe</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
              {/* Placeholder for a real map */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15743.76567527123!2d-76.2483556094602!3d-9.927237841584988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91a7c3c2e7b9b139%3A0x9cb133e6f6aa7a7!2sHu%C3%A1nuco%2C%20Peru!5e0!3m2!1sen!2sus!4v1672532585432!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de TechStore"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}