// src/components/store/Cart.tsx (new)
import { useState, useEffect } from 'react';
import { cart as apiCart } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCart.get().then(({ data }) => {
      setCartItems(data.items || []);
      setLoading(false);
    });
  }, []);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await apiCart.update(productId, quantity);
    setCartItems(prev => prev.map(item => item.product._id === productId ? {...item, quantity} : item));
  };

  const handleRemove = async (productId: string) => {
    await apiCart.remove(productId);
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
    toast.success('Producto removido');
  };

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex gap-4 border p-4 rounded">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold">{item.product.name}</h3>
                  <p>S/ {item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button onClick={() => handleRemove(item.product._id)}><Trash2 /></button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <p className="text-xl font-bold">Total: S/ {total.toFixed(2)}</p>
            <Link to="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded mt-4 inline-block">Proceder al Pago</Link>
          </div>
        </>
      )}
    </div>
  );
}