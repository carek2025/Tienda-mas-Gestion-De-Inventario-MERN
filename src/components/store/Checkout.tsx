// src/components/store/Checkout.tsx (new)
import { useState, useEffect } from 'react';
import { cart as apiCart, orders } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    address: '',
    paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCart.get().then(({ data }) => {
      setCartItems(data.items || []);
      setLoading(false);
    });
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.quantity * item.product.price,
      })),
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      totalAmount: total,
    };
    await orders.create(orderData);
    await apiCart.clear();
    toast.success('Compra realizada exitosamente');
    navigate('/history');
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 flex gap-8">
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección de Envío" className="w-full border p-2 rounded" required />
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="card">Tarjeta</option>
            <option value="cash">Efectivo</option>
            <option value="transfer">Transferencia</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Completar Compra</button>
        </form>
      </div>
      <div className="w-1/3 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Resumen</h2>
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex justify-between mb-2">
            <span>{item.product.name} x {item.quantity}</span>
            <span>S/ {(item.quantity * item.product.price).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 font-bold flex justify-between">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}