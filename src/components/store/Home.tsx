// src/components/store/Home.tsx
import { useState, useEffect } from 'react';
import { products as apiProducts, cart as apiCart } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ArrowRight, Wrench, Home as HomeIcon, Lightbulb, ShieldCheck, Truck, CreditCard, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiProducts.getAll().then(({ data }) => {
      if (data) {
        setFeaturedProducts(data.slice(0, 8));
        setLatestProducts(data.slice(8, 16));
      }
      setLoading(false);
    });
  }, []);

  const benefits = [
    { icon: <Truck size={28} />, title: 'Envío a Nivel Nacional', text: 'Llegamos a cada rincón del país.' },
    { icon: <CreditCard size={28} />, title: 'Pagos Seguros', text: 'Todas tus transacciones están protegidas.' },
    { icon: <ShieldCheck size={28} />, title: 'Garantía de Calidad', text: 'Solo los mejores productos para ti.' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Carousel */}
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={5000} className="hero-carousel">
        <div className="relative h-[60vh] text-white">
          <img 
            src="https://images.unsplash.com/photo-1600585152220-014add7153cb?q=80&w=2070&auto=format&fit=crop" 
            alt="Hogar moderno" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">Renueva tu Hogar con Estilo</h1>
              <p className="text-lg md:text-xl mb-8 animate-fade-in-up">Encuentra todo lo que necesitas en electrodomésticos y acabados de primera.</p>
              <Link 
                to="/products" 
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-transform hover:scale-105 inline-block animate-fade-in-up"
              >
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>

        <div className="relative h-[60vh] text-white">
          <img 
            src="https://images.unsplash.com/photo-1581154593929-a1bce999318b?q=80&w=2070&auto=format&fit=crop" 
            alt="Herramientas" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Herramientas para Profesionales</h1>
              <p className="text-lg md:text-xl mb-8">Potencia, durabilidad y precisión para cada uno de tus proyectos.</p>
              <Link 
                to="/products" 
                className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform hover:scale-105 inline-block"
              >
                Descubrir Herramientas
              </Link>
            </div>
          </div>
        </div>
      </Carousel>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-xl shadow-lg">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-blue-600">{benefit.icon}</div>
              <div>
                <h3 className="font-bold text-gray-800">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Sobre Nosotros</h2>
        <p className="text-gray-600">
          TechStore es una empresa líder en la venta de productos para el hogar y construcción. 
          Con más de 15 años de experiencia, ofrecemos calidad y servicio excepcional a nuestros clientes en todo el país.
        </p>
        <p className="text-gray-600">
          Nuestra misión es proporcionar herramientas y electrodomésticos de alta calidad a precios accesibles, 
          con un enfoque en la satisfacción del cliente.
        </p>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Productos Destacados</h2>
          <p className="text-gray-500 mt-2">Los favoritos de nuestros clientes, seleccionados para ti.</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 text-white rounded-lg p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-3">¡Ofertas Exclusivas en Herramientas!</h2>
            <p className="text-gray-300 mb-6">Equipa tu taller con descuentos de hasta 30%. ¡Solo por tiempo limitado!</p>
            <Link 
              to="/products" 
              className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform hover:scale-105 inline-block"
            >
              Ver Ofertas
            </Link>
          </div>
          <Wrench size={100} className="text-yellow-400 opacity-80" />
        </div>
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Novedades</h2>
          <p className="text-gray-500 mt-2">Descubre lo último que ha llegado a nuestra tienda.</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        .hero-carousel .slide { text-align: left; }
        .animate-fade-in-down { animation: fadeInDown 1s ease-out both; }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out 0.5s both; }
        @keyframes fadeInDown { 
          0% { opacity: 0; transform: translateY(-20px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        @keyframes fadeInUp { 
          0% { opacity: 0; transform: translateY(20px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}

// ProductCard Component
function ProductCard({ product }: { product: any }) {
  const { _id, name, price, imageUrl, stock, brand } = product;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await apiCart.add(_id, 1);
      toast.success(`${name} añadido al carrito!`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch {
      toast.error('Error al añadir al carrito');
    }
  };

  return (
    <Link 
      to={`/product/${_id}`} 
      className="bg-white rounded-lg shadow-md overflow-hidden group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
    >
      <div className="relative">
        <img 
          src={imageUrl || '/placeholder.jpg'} 
          alt={name} 
          className="w-full h-56 object-cover group-hover:opacity-80 transition-opacity"
        />
        {stock <= 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Agotado
          </span>
        )}
        {stock > 0 && stock <= 10 && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded">
            ¡Últimas unidades!
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500">{brand}</p>
        <h3 className="font-bold text-gray-800 mt-1 flex-grow">{name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-green-600">S/ {price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="bg-blue-100 text-blue-600 p-2 rounded-full transform transition-all opacity-0 group-hover:opacity-100 group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200"
            aria-label="Añadir al carrito"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
}