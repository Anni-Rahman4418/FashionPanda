import axios from 'axios';
import { Product, Order, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '../data/mockData';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE = `${API_ROOT}/api`;

const STORAGE_KEYS = {
  PRODUCTS: 'fp_products',
  ORDERS: 'fp_orders',
  USERS: 'fp_users',
  CART: 'fp_cart'
};

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
  async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await axios.get(`${API_ROOT}/`, { timeout: 2500 });
      return res.status === 200;
    } catch {
      return false;
    }
  },

  // PRODUCTS CRUD
  async getProducts(): Promise<Product[]> {
    try {
      const res = await axios.get(`${API_BASE}/products`, { timeout: 3000 });
      setStored(STORAGE_KEYS.PRODUCTS, res.data);
      return res.data;
    } catch (err) {
      return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const res = await axios.post(`${API_BASE}/products`, productData, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const updated = [newProduct, ...products];
      setStored(STORAGE_KEYS.PRODUCTS, updated);
      return newProduct;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await axios.put(`${API_BASE}/products/${id}`, updates, { timeout: 3000 });
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
      await axios.delete(`${API_BASE}/products/${id}`, { timeout: 3000 });
      return true;
    } catch (err) {
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      setStored(STORAGE_KEYS.PRODUCTS, products.filter(p => p.id !== id));
      return true;
    }
  },

  // ORDERS CRUD
  async getOrders(): Promise<Order[]> {
    try {
      const res = await axios.get(`${API_BASE}/orders`, { timeout: 3000 });
      setStored(STORAGE_KEYS.ORDERS, res.data);
      return res.data;
    } catch (err) {
      return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      const res = await axios.post(`${API_BASE}/orders`, orderData, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toLocaleString()
      };
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const updated = [newOrder, ...orders];
      setStored(STORAGE_KEYS.ORDERS, updated);
      return newOrder;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const res = await axios.put(`${API_BASE}/orders/${id}`, { status }, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const index = orders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      const updatedOrder = { ...orders[index], status };
      orders[index] = updatedOrder;
      setStored(STORAGE_KEYS.ORDERS, orders);
      return updatedOrder;
    }
  },

  async cancelOrder(id: string): Promise<boolean> {
    return this.updateOrderStatus(id, 'Cancelled').then(() => true);
  },

  // USERS CRUD
  async getUsers(): Promise<User[]> {
    try {
      const res = await axios.get(`${API_BASE}/users`, { timeout: 3000 });
      setStored(STORAGE_KEYS.USERS, res.data);
      return res.data;
    } catch (err) {
      return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const res = await axios.post(`${API_BASE}/register`, userData, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      setStored(STORAGE_KEYS.USERS, [...users, newUser]);
      return newUser;
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const res = await axios.put(`${API_BASE}/users/${id}`, updates, { timeout: 3000 });
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
      await axios.delete(`${API_BASE}/users/${id}`, { timeout: 3000 });
      return true;
    } catch (err) {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      setStored(STORAGE_KEYS.USERS, users.filter(u => u.id !== id));
      return true;
    }
  }
};
