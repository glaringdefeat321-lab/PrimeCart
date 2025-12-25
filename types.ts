export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  items: CartItem[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  growth: number;
}