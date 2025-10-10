import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techstore')
  .then(() => console.log('✅ MongoDB conectado exitosamente'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Schemas
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  minStock: { type: Number, required: true, default: 5, min: 0 },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const saleSchema = new mongoose.Schema({
  saleNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerDocument: { type: String, default: '' },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true, default: 'cash' },
  status: { type: String, required: true, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

const saleItemSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const inventoryAlertSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  alertType: { type: String, required: true, default: 'low_stock' },
  message: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true, default: 'employee' },
  createdAt: { type: Date, default: Date.now }
});

// Agregar estos esquemas al server/index.js

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Sale = mongoose.model('Sale', saleSchema);
const SaleItem = mongoose.model('SaleItem', saleItemSchema);
const InventoryAlert = mongoose.model('InventoryAlert', inventoryAlertSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-jwt');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// AUTH ROUTES
// server/index.js - Actualizaciones en las rutas de auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'customer' } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, fullName, role });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'tu-secreto-jwt', { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        fullName: user.fullName,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'tu-secreto-jwt', { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        fullName: user.fullName,
        role: user.role  // ← Agregar esta línea
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// CATEGORIES ROUTES
app.get('/api/categories', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// PRODUCTS ROUTES
app.get('/api/products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name').sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    // Check if stock is low
    if (product.stock <= product.minStock) {
      const alert = new InventoryAlert({
        productId: product._id,
        alertType: 'low_stock',
        message: `El producto "${product.name}" tiene stock bajo (${product.stock} unidades). Stock mínimo: ${product.minStock}`
      });
      await alert.save();
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    // Check if stock is low
    if (product.stock <= product.minStock) {
      const existingAlert = await InventoryAlert.findOne({
        productId: product._id,
        isResolved: false
      });
      
      if (!existingAlert) {
        const alert = new InventoryAlert({
          productId: product._id,
          alertType: 'low_stock',
          message: `El producto "${product.name}" tiene stock bajo (${product.stock} unidades). Stock mínimo: ${product.minStock}`
        });
        await alert.save();
      }
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// SALES ROUTES
app.get('/api/sales', authMiddleware, async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

app.post('/api/sales', authMiddleware, async (req, res) => {
  try {
    const { customerName, customerDocument, paymentMethod, items } = req.body;
    
    // Generate sale number
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Sale.countDocuments({
      createdAt: { $gte: today }
    });
    const saleNumber = `V-${today.toISOString().slice(0, 10).replace(/-/g, '')}-${String(count + 1).padStart(4, '0')}`;
    
    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Create sale
    const sale = new Sale({
      saleNumber,
      userId: req.userId,
      customerName,
      customerDocument,
      totalAmount,
      paymentMethod,
      status: 'completed'
    });
    await sale.save();
    
    // Create sale items and update stock
    for (const item of items) {
      const saleItem = new SaleItem({
        saleId: sale._id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      });
      await saleItem.save();
      
      // Update product stock
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
      
      // Check if stock is low
      if (product.stock <= product.minStock) {
        const existingAlert = await InventoryAlert.findOne({
          productId: product._id,
          isResolved: false
        });
        
        if (!existingAlert) {
          const alert = new InventoryAlert({
            productId: product._id,
            alertType: 'low_stock',
            message: `El producto "${product.name}" tiene stock bajo (${product.stock} unidades). Stock mínimo: ${product.minStock}`
          });
          await alert.save();
        }
      }
    }
    
    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear venta' });
  }
});

// ALERTS ROUTES
app.get('/api/alerts', authMiddleware, async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    
    if (filter === 'active') {
      query.isResolved = false;
    } else if (filter === 'resolved') {
      query.isResolved = true;
    }
    
    const alerts = await InventoryAlert.find(query)
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

app.put('/api/alerts/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const alert = await InventoryAlert.findByIdAndUpdate(
      req.params.id,
      { isResolved: true, resolvedAt: Date.now() },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Error al resolver alerta' });
  }
});

// DASHBOARD ROUTES
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalProducts = await Product.countDocuments();
    const products = await Product.find();
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    
    const todaySales = await Sale.find({ createdAt: { $gte: today } });
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    const activeAlerts = await InventoryAlert.countDocuments({ isResolved: false });
    
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    
    res.json({
      totalProducts,
      lowStockProducts,
      todaySales: todaySales.length,
      todayRevenue,
      activeAlerts,
      totalInventoryValue
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Initialize categories
app.post('/api/init-categories', async (req, res) => {
  try {
    const categories = [
      { name: 'Herramientas', description: 'Herramientas manuales y eléctricas para construcción y reparación' },
      { name: 'Electrohogar', description: 'Electrodomésticos y equipos para el hogar' },
      { name: 'Climatización', description: 'Equipos de calefacción, ventilación y aire acondicionado' },
      { name: 'Construcción', description: 'Materiales y equipos para construcción' },
      { name: 'Tecnología', description: 'Dispositivos electrónicos y tecnología' }
    ];
    
    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true }
      );
    }
    
    res.json({ message: 'Categorías inicializadas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al inicializar categorías' });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// Obtener un pedido específico
app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
});

// Crear un nuevo pedido
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    
    // Generar número de pedido
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    const orderNumber = `ORD-${today.toISOString().slice(0, 10).replace(/-/g, '')}-${String(count + 1).padStart(4, '0')}`;
    
    // Verificar stock y preparar items con información del producto
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Producto ${item.productId} no encontrado` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      }
      
      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      });
      
      // Actualizar stock
      product.stock -= item.quantity;
      await product.save();
      
      // Verificar si stock es bajo y crear alerta
      if (product.stock <= product.minStock) {
        const existingAlert = await InventoryAlert.findOne({
          productId: product._id,
          isResolved: false
        });
        
        if (!existingAlert) {
          const alert = new InventoryAlert({
            productId: product._id,
            alertType: 'low_stock',
            message: `El producto "${product.name}" tiene stock bajo (${product.stock} unidades). Stock mínimo: ${product.minStock}`
          });
          await alert.save();
        }
      }
    }
    
    // Crear pedido
    const order = new Order({
      orderNumber,
      userId: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending'
    });
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// Actualizar estado del pedido
app.put('/api/orders/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// Cancelar pedido
app.delete('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ error: 'No se puede cancelar este pedido' });
    }
    
    // Restaurar stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    order.status = 'cancelled';
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({ message: 'Pedido cancelado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar pedido' });
  }
});

// ADMIN ROUTES - Solo para empleados
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'employee') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error de autorización' });
  }
};

// Obtener todos los pedidos (admin)
app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email')
      .populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Actualizar estado de pedido (admin)
app.put('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'fullName email');
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// Estadísticas del dashboard (actualizado con pedidos)
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalProducts = await Product.countDocuments();
    const products = await Product.find();
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    
    // Ventas del día (pedidos completados)
    const todayOrders = await Order.find({ 
      createdAt: { $gte: today },
      status: { $in: ['delivered', 'processing', 'shipped'] }
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const activeAlerts = await InventoryAlert.countDocuments({ isResolved: false });
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    
    // Pedidos pendientes
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const totalOrders = await Order.countDocuments();
    
    res.json({
      totalProducts,
      lowStockProducts,
      todaySales: todayOrders.length,
      todayRevenue,
      activeAlerts,
      totalInventoryValue,
      pendingOrders,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});
// User profile
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// Update password
app.put('/api/user/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});