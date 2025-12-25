import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, ShoppingBag, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { UserRole } from '../types';

export const Home = () => {
  const { products, user, login } = useStore();
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 4);

  const handleAdminRedirect = () => {
    if (user?.role !== UserRole.ADMIN) {
        login(UserRole.ADMIN);
    }
    navigate('/admin');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative bg-primary overflow-hidden h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-6 leading-tight">
              Elevate Your <br/> <span className="text-luxury">Everyday Style</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Discover the finest collection of luxury apparel and accessories on PrimeCart, curated by AI for your unique taste.
            </p>
            <Link to="/shop" className="inline-flex items-center bg-luxury text-primary px-8 py-3 rounded-md font-bold hover:bg-white transition-colors duration-300">
              Shop Collection <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <div className="bg-white p-3 rounded-full shadow-sm text-luxury">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500">On all orders over $200</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <div className="bg-white p-3 rounded-full shadow-sm text-luxury">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <div className="bg-white p-3 rounded-full shadow-sm text-luxury">
              <RefreshCw size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Arrivals</h2>
            <p className="text-gray-500 mt-2">Curated selection of this season's favorites</p>
          </div>
          <Link to="/shop" className="text-luxury font-medium hover:text-yellow-600 flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <ShoppingBag size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                    Your store is empty. Log in as an admin to add your first product.
                </p>
                <button 
                    onClick={handleAdminRedirect}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-slate-800 focus:outline-none"
                >
                    <Plus size={16} className="mr-2" />
                    Go to Admin Dashboard
                </button>
            </div>
        )}
      </div>

      {/* Newsletter / CTA */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Join the PrimeCart Club</h2>
          <p className="text-gray-400 mb-8">Sign up for early access to new drops and personalized AI styling tips.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Email Address" className="px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury bg-gray-800 text-white border border-gray-700 w-full" />
            <button className="bg-luxury text-primary font-bold px-8 py-3 rounded-md hover:bg-white transition-colors w-full sm:w-auto">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};