// src/components/store/Home.tsx (new)
import { useState, useEffect } from 'react';
import { products as apiProducts } from '../../lib/api';
import { Link } from 'react-router-dom';

export function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiProducts.getAll().then(({ data }) => {
      setProducts(data.slice(0, 8)); // Show featured products
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Banner */}
      <div className="relative h-96 bg-blue-600 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenido a TechStore</h1>
          <p className="text-xl mb-6">Descubre los mejores productos en herramientas, electrohogar y tecnología</p>
          <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">Comprar Ahora</Link>
        </div>
      </div>

      {/* Welcome and Company Info */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold">Sobre Nosotros</h2>
        <p className="text-gray-600">TechStore es una empresa líder en la venta de productos para el hogar y construcción. Con más de 15 años de experiencia, ofrecemos calidad y servicio excepcional a nuestros clientes en todo el país.</p>
        <p className="text-gray-600">Nuestra misión es proporcionar herramientas y electrodomésticos de alta calidad a precios accesibles, con un enfoque en la satisfacción del cliente.</p>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Productos Destacados</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="bg-white rounded-lg shadow hover:shadow-lg">
                <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-green-600">S/ {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}