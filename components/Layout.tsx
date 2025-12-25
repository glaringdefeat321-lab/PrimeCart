import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut, Settings, Search, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { cart, user, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, login, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRoleSwitch = () => {
    if (user?.role === UserRole.ADMIN) {
      login(UserRole.CUSTOMER);
      navigate('/');
    } else {
      login(UserRole.ADMIN);
      navigate('/admin');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
        setIsSearchOpen(false);
        setSearchQuery('');
        setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 mr-2 sm:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                Prime<span className="text-luxury">Cart</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex space-x-8 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-black transition-colors">New Arrivals</Link>
              <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
              <Link to="/shop?category=Accessories" className="hover:text-black transition-colors">Accessories</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Search */}
              <div className="hidden sm:flex items-center">
                  {isSearchOpen ? (
                      <form onSubmit={handleSearch} className="relative flex items-center animate-in slide-in-from-right-5 duration-200">
                          <input 
                              type="text" 
                              autoFocus
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onBlur={(e) => {
                                  // Small delay to allow form submission if clicking something else
                                  setTimeout(() => {
                                      if (!searchQuery) setIsSearchOpen(false);
                                  }, 100);
                              }}
                              placeholder="Search..."
                              className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-full text-sm focus:border-luxury focus:ring-1 focus:ring-luxury focus:outline-none w-48 transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} 
                            className="absolute right-2 text-gray-400 hover:text-gray-600"
                          >
                              <X size={14} />
                          </button>
                      </form>
                  ) : (
                      <button 
                        onClick={() => setIsSearchOpen(true)} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Search size={20} className="text-gray-600" />
                      </button>
                  )}
              </div>
              
              <div className="relative group hidden sm:block">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User size={20} className="text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-2">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-500">Signed in as <br/><span className="font-semibold text-gray-900">{user.name}</span></div>
                        <div className="border-t my-1"></div>
                        <button onClick={handleRoleSwitch} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                          <Settings size={16} className="mr-2" />
                          Switch to {user.role === UserRole.ADMIN ? 'Customer' : 'Admin'}
                        </button>
                        <button onClick={logout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button onClick={() => login(UserRole.CUSTOMER)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsCartOpen(true)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ShoppingBag size={20} className="text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-luxury rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white">
            <div className="px-4 pt-4 pb-2">
                <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-luxury focus:ring-1 focus:ring-luxury focus:outline-none"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </form>
            </div>

            <div className="px-2 pt-2 pb-3 space-y-1">
               <Link 
                 to="/" 
                 onClick={handleLinkClick}
                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
               >
                 New Arrivals
               </Link>
               <Link 
                 to="/shop" 
                 onClick={handleLinkClick}
                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
               >
                 Shop Collection
               </Link>
               <Link 
                 to="/shop?category=Accessories" 
                 onClick={handleLinkClick}
                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
               >
                 Accessories
               </Link>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-gray-800">{user?.name || 'Guest'}</div>
                  <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user?.email || ''}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                 <button 
                    onClick={handleRoleSwitch}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                 >
                    Switch to {user?.role === UserRole.ADMIN ? 'Customer' : 'Admin'} Mode
                 </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-4">PrimeCart</h3>
              <p className="text-gray-400 text-sm">Redefining luxury e-commerce with artificial intelligence.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Men</a></li>
                <li><a href="#" className="hover:text-white">Women</a></li>
                <li><a href="#" className="hover:text-white">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <div className="flex">
                <input type="email" placeholder="Your email" className="bg-slate-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-full border border-slate-700" />
                <button className="bg-luxury px-4 py-2 rounded-r-md text-primary font-bold hover:bg-yellow-500 transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-gray-500">
            &copy; 2024 PrimeCart AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between px-4 py-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <ShoppingBag size={48} className="mb-4 opacity-50" />
                    <p>Your cart is empty.</p>
                    <button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} className="mt-4 text-luxury font-medium hover:underline">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex py-2">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${item.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center border rounded">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                              <span className="px-2">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-luxury hover:text-yellow-600">Remove</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                    <p>Subtotal</p>
                    <p>${totalCartPrice.toFixed(2)}</p>
                  </div>
                  <button onClick={() => {setIsCartOpen(false); navigate('/checkout')}} className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-slate-800 transition-colors">
                    Checkout <ChevronRight size={16} className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};