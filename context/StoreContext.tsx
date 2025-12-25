import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, UserRole, Order } from '../types';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_ADMIN } from '../services/mockData';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  user: User | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerDetails: any) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Load initial state from LocalStorage if available, otherwise use defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('prime_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('prime_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('prime_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // FIX: Load user from local storage so refreshing doesn't kick admin out
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('prime_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('prime_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('prime_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('prime_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('prime_user', JSON.stringify(user));
  }, [user]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customerDetails: any) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      status: 'Pending',
      items: [...cart]
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const login = (role: UserRole) => {
    if (role === UserRole.ADMIN) {
      setUser(MOCK_ADMIN);
    } else {
      setUser(MOCK_USER);
    }
  };

  const logout = () => setUser(null);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      user,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      login,
      logout,
      isCartOpen,
      setIsCartOpen,
      addProduct,
      deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};