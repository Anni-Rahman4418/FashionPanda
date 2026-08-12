import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, Order, CartItem, UserRole } from '../types';
import { apiService } from '../services/api';
import { INITIAL_USERS } from '../data/mockData';

export type ActiveViewMode = 'marketplace' | 'retailer' | 'admin';

interface AppContextType {
  // Navigation View & Health
  activeView: ActiveViewMode;
  setActiveView: (view: ActiveViewMode) => void;
  isBackendOnline: boolean;

  // Auth & Roles
  currentUser: User;
  users: User[];
  isAuthenticated: boolean;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  registerUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;

  // Products CRUD
  products: Product[];
  isLoadingProducts: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart CRUD
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders CRUD
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (paymentMethod: Order['paymentMethod'], address: string, phone: string) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;

  // UI Modals & Notifications
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  isProductFormOpen: boolean;
  setIsProductFormOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (p: Product | null) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveViewMode>('marketplace');
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Toast Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initial Data Load & Backend Health Check
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingProducts(true);
      const isOnline = await apiService.checkBackendHealth();
      setIsBackendOnline(isOnline);

      try {
        const [prods, ords, usrs] = await Promise.all([
          apiService.getProducts(),
          apiService.getOrders(),
          apiService.getUsers()
        ]);
        setProducts(prods);
        setOrders(ords);
        setUsers(usrs);
        if (ords.length > 0) setActiveOrder(ords[0]);
      } catch (err) {
        console.error('Data load error:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadInitialData();
  }, []);

  // LOGIN (calls backend POST /api/login)
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const user = await apiService.login(email, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUsers(prev => (prev.some(u => u.id === user.id) ? prev : [...prev, user]));
      showToast(`Welcome back, ${user.name}!`, 'success');
      return user;
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Invalid email or password';
      showToast(message, 'error');
      throw err;
    }
  };

  // LOGOUT
  const logout = () => {
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(false);
    setActiveOrder(null);
    setActiveView('marketplace');
    showToast('Logged out successfully', 'info');
  };

  // ROLE SWITCHER
  const switchRole = (role: UserRole) => {
    const existing = users.find(u => u.role === role);
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${role}@fashionpanda.com`,
        role,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
    setIsAuthenticated(true);

    if (role === 'retailer') setActiveView('retailer');
    else if (role === 'admin') setActiveView('admin');
    else setActiveView('marketplace');

    showToast(`Switched view to ${role.toUpperCase()}`, 'info');
  };

  // USER CRUD
  const registerUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const created = await apiService.createUser(userData);
    setUsers(prev => [...prev, created]);
    setCurrentUser(created);
    setIsAuthenticated(true);
    showToast(`Welcome to FashionPanda, ${created.name}!`, 'success');
    return created;
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
    const updated = await apiService.updateUser(id, updates);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
    if (currentUser.id === id) setCurrentUser(updated);
    showToast('User profile updated', 'success');
    return updated;
  };

  const deleteUser = async (id: string) => {
    await apiService.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User deleted', 'info');
  };

  // PRODUCT CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const created = await apiService.createProduct(productData);
    setProducts(prev => [created, ...prev]);
    showToast(`Added product "${created.name}"`, 'success');
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const updated = await apiService.updateProduct(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    showToast(`Updated "${updated.name}"`, 'success');
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await apiService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  // CART CRUD
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + quantity };
        return copy;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    showToast(`Added ${product.name} to Cart`, 'success');
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity };
      return copy;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // ORDERS CRUD
  const createOrder = async (
    paymentMethod: Order['paymentMethod'],
    address: string,
    phone: string
  ): Promise<Order> => {
    const subtotal = cartTotal;
    const deliveryFee = 4.99;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + deliveryFee + tax).toFixed(2));

    const orderData: Omit<Order, 'id' | 'createdAt'> = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAddress: address || currentUser.address || 'Standard Address, Express Zone',
      userPhone: phone || '+1 (555) 392-1029',
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod,
      status: 'Placed',
      estimatedDeliveryTime: '35 - 45 mins',
      courierName: 'Panda Rider Express',
      courierPhone: '+1 (555) 900-1122'
    };

    const newOrder = await apiService.createOrder(orderData);
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    showToast('Order placed! Express courier assigned 🛵', 'success');
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const updated = await apiService.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    if (activeOrder?.id === id) setActiveOrder(updated);
    showToast(`Order ${id} status: ${status}`, 'info');
  };

  const cancelOrder = async (id: string) => {
    await apiService.cancelOrder(id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    if (activeOrder?.id === id) setActiveOrder(prev => prev ? { ...prev, status: 'Cancelled' } : null);
    showToast(`Order ${id} cancelled`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        isBackendOnline,
        currentUser,
        users,
        isAuthenticated,
        setCurrentUser,
        switchRole,
        login,
        logout,
        registerUser,
        updateUser,
        deleteUser,
        products,
        isLoadingProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        editingProduct,
        setEditingProduct,
        isProductFormOpen,
        setIsProductFormOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
