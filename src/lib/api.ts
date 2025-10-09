import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data } = await api.post('/auth/register', { email, password, fullName });
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

  onAuthStateChange: (callback: (user: any) => void) => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getUser().then(({ data }) => {
        callback(data);
      });
    } else {
      callback(null);
    }
    return { unsubscribe: () => {} };
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

  create: async (category: any) => {
    try {
      const { data } = await api.post('/categories', category);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al crear categoría' };
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