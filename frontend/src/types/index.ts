export type UserRole = 'customer' | 'retailer' | 'admin' | 'courier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  storeName?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Streetwear' | 'Formal' | 'Casual' | 'Accessories' | 'Luxury' | 'Footwear';
  imageUrl: string;
  stock: number;
  retailerId: string;
  retailerName: string;
  sizes: string[];
  colors: string[];
  rating: number;
  deliveryEtaMinutes: number;
  isExpress: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'Placed' | 'Accepted' | 'Packing' | 'Courier Picked Up' | 'On The Way' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Cash on Delivery' | 'Panda Wallet';
  status: OrderStatus;
  estimatedDeliveryTime: string;
  courierName?: string;
  courierPhone?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
