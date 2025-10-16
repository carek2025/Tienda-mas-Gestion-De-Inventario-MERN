// src/lib/api.ts (updated with new endpoints for store)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_API || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  signIn: async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.error || 'Error al iniciar sesión' };
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: string) => {
    try {
      const { data } = await api.post('/auth/register', { email, password, fullName, role });
      localStorage.setItem('token', data.token);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.error || 'Error al registrar usuario' };
    }
  },

  signOut: async () => {
    localStorage.removeItem('token');
    return { error: null };
  },

  getUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener usuario' };
    }
  },

  updateUser: async (userData: any) => {
    try {
      const { data } = await api.put('/auth/me', userData);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al actualizar perfil' };
    }
  },
};

// Categories
export const categories = {
  getAll: async () => {
    try {
      const { data } = await api.get('/categories');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener categorías' };
    }
  },
};

// Products
export const products = {
  getAll: async () => {
    try {
      const { data } = await api.get('/products');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener productos' };
    }
  },

  getOne: async (id: string) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener producto' };
    }
  },

  create: async (product: any) => {
    try {
      const { data } = await api.post('/products', product);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al crear producto' };
    }
  },

  update: async (id: string, product: any) => {
    try {
      const { data } = await api.put(`/products/${id}`, product);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al actualizar producto' };
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      return { error: null };
    } catch (error) {
      return { error: 'Error al eliminar producto' };
    }
  },
};

// Sales
export const sales = {
  getAll: async () => {
    try {
      const { data } = await api.get('/sales');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener ventas' };
    }
  },

  create: async (sale: any) => {
    try {
      const { data } = await api.post('/sales', sale);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al crear venta' };
    }
  },
};

// Alerts
export const alerts = {
  getAll: async (filter?: string) => {
    try {
      const { data } = await api.get('/alerts', { params: { filter } });
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener alertas' };
    }
  },

  resolve: async (id: string) => {
    try {
      const { data } = await api.put(`/alerts/${id}/resolve`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al resolver alerta' };
    }
  },
};

// Dashboard
export const dashboard = {
  getStats: async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener estadísticas' };
    }
  },
};

// Favorites
export const favorites = {
  getAll: async () => {
    try {
      const { data } = await api.get('/favorites');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener favoritos' };
    }
  },

  add: async (productId: string) => {
    try {
      const { data } = await api.post('/favorites', { productId });
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al añadir favorito' };
    }
  },

  remove: async (productId: string) => {
    try {
      await api.delete(`/favorites/${productId}`);
      return { error: null };
    } catch (error) {
      return { error: 'Error al remover favorito' };
    }
  },
};

// Cart
export const cart = {
  get: async () => {
    try {
      const { data } = await api.get('/cart');
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener carrito' };
    }
  },

  add: async (productId: string, quantity: number) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al añadir al carrito' };
    }
  },

  update: async (productId: string, quantity: number) => {
    try {
      const { data } = await api.put('/cart', { productId, quantity });
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al actualizar carrito' };
    }
  },

  remove: async (productId: string) => {
    try {
      await api.delete(`/cart/${productId}`);
      return { error: null };
    } catch (error) {
      return { error: 'Error al remover del carrito' };
    }
  },

  clear: async () => {
    try {
      await api.delete('/cart');
      return { error: null };
    } catch (error) {
      return { error: 'Error al vaciar carrito' };
    }
  },
};

// Orders - CORREGIDO
export const orders = {
  getAll: async () => {
    try {
      const { data } = await api.get('/orders');
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener órdenes' };
    }
  },

  create: async (orderData: any) => {
    try {
      // Asegurar que los datos tengan la estructura correcta
      const formattedData = {
        items: orderData.items.map((item: any) => ({
          productId: item.productId || item.product?._id,
          quantity: item.quantity,
          unitPrice: item.unitPrice || item.price || item.product?.price,
          subtotal: item.subtotal || (item.quantity * (item.unitPrice || item.price || item.product?.price))
        })),
        address: orderData.address,
        paymentMethod: orderData.paymentMethod,
        totalAmount: orderData.totalAmount
      };

      console.log('Enviando orden:', formattedData); // Para debug

      const { data } = await api.post('/orders', formattedData);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error en create order:', error.response?.data);
      return { 
        data: null, 
        error: error.response?.data?.error || 'Error al crear orden' 
      };
    }
  },
};

// Reviews
export const reviews = {
  getForProduct: async (productId: string) => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener reseñas' };
    }
  },

  create: async (productId: string, review: any) => {
    try {
      const { data } = await api.post('/reviews', { productId, ...review });
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al crear reseña' };
    }
  },
};

// Initialize categories
export const initCategories = async () => {
  try {
    await api.post('/init-categories');
    return { error: null };
  } catch (error) {
    return { error: 'Error al inicializar categorías' };
  }
};

export default api;