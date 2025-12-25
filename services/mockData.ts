import { Product, User, UserRole, DashboardStats } from '../types';

// Start with an empty catalog so the user can add their own products.
export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Demo Customer',
  email: 'customer@example.com',
  role: UserRole.CUSTOMER,
  avatar: 'https://ui-avatars.com/api/?name=Demo+Customer'
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Store Owner',
  email: 'admin@primecart.ai',
  role: UserRole.ADMIN,
  avatar: 'https://ui-avatars.com/api/?name=Store+Owner'
};

// Initial empty stats
export const MOCK_STATS: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  activeCustomers: 0,
  growth: 0
};

// Empty sales data
export const SALES_DATA = [];