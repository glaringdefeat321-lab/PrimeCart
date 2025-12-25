import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock < 10 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
            Low Stock
          </span>
        )}
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-serif font-medium text-gray-900 group-hover:text-luxury transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          <p className="text-lg font-semibold text-gray-900">${product.price}</p>
        </div>
        
        <div className="flex items-center mb-4">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews})</span>
        </div>

        <button 
          onClick={() => addToCart(product)}
          className="w-full flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-luxury transition-colors duration-200"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};