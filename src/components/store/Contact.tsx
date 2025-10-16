// src/components/store/Contact.tsx (new)
export function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Contáctanos</h1>
      <p className="mb-4">Estamos aquí para ayudarte. Envíanos un mensaje o visítanos en nuestra ubicación.</p>
      <form className="space-y-4">
        <input placeholder="Nombre" className="w-full border p-2 rounded" />
        <input placeholder="Email" className="w-full border p-2 rounded" />
        <textarea placeholder="Mensaje" className="w-full border p-2 rounded h-32" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
        <p>Av. Principal 123, Ciudad Ejemplo</p>
        <div className="mt-4 h-64 bg-gray-200 rounded">Mapa placeholder</div>
      </div>
    </div>
  );
}