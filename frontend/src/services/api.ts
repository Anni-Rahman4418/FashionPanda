import axios from 'axios';
import { Product, Order, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '../data/mockData';

const API_BASE = '/api';

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'fp_products',
  ORDERS: 'fp_orders',
  USERS: 'fp_users',
  CART: 'fp_cart',
  USER: 'fp_active_user'
};

// Helper to get stored items or initialize with defaults
const getStored = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const apiService = {
  // PRODUCTS CRUD
  async getProducts(): Promise<Product[]> {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      return res.data;
    } catch (err) {
      // LocalStorage fallback
      return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await axios.post(`${API_BASE}/products`, newProduct);
      return res.data;
    } catch (err) {
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const updated = [newProduct, ...products];
      setStored(STORAGE_KEYS.PRODUCTS, updated);
      return newProduct;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await axios.put(`${API_BASE}/products/${id}`, updates);
      return res.data;
    } catch (err) {
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      const updatedProduct = { ...products[index], ...updates };
      products[index] = updatedProduct;
      setStored(STORAGE_KEYS.PRODUCTS, products);
      return updatedProduct;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      return true;
    } catch (err) {
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const filtered = products.filter(p => p.id !== id);
      setStored(STORAGE_KEYS.PRODUCTS, filtered);
      return true;
    }
  },

  // ORDERS CRUD
  async getOrders(): Promise<Order[]> {
    try {
      const res = await axios.get(`${API_BASE}/orders`);
      return res.data;
    } catch (err) {
      return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString()
    };
    try {
      const res = await axios.post(`${API_BASE}/orders`, newOrder);
      return res.data;
    } catch (err) {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const updated = [newOrder, ...orders];
      setStored(STORAGE_KEYS.ORDERS, updated);
      return newOrder;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const res = await axios.put(`${API_BASE}/orders/${id}`, { status });
      return res.data;
    } catch (err) {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const index = orders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      orders[index].status = status;
      setStored(STORAGE_KEYS.ORDERS, orders);
      return orders[index];
    }
  },

  async cancelOrder(id: string): Promise<boolean> {
    return this.updateOrderStatus(id, 'Cancelled').then(() => true);
  },

  // USERS CRUD
  async getUsers(): Promise<User[]> {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      return res.data;
    } catch (err) {
      return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await axios.post(`${API_BASE}/register`, newUser);
      return res.data;
    } catch (err) {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const updated = [...users, newUser];
      setStored(STORAGE_KEYS.USERS, updated);
      return newUser;
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const res = await axios.put(`${API_BASE}/users/${id}`, updates);
      return res.data;
    } catch (err) {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const index = users.findIndex(u => u.id === id);
      if (index === -1) throw new Error('User not found');
      users[index] = { ...users[index], ...updates };
      setStored(STORAGE_KEYS.USERS, users);
      return users[index];
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      return true;
    } catch (err) {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      setStored(STORAGE_KEYS.USERS, users.filter(u => u.id !== id));
      return true;
    }
  }
};
