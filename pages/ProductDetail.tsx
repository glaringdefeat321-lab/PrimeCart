import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, Sparkles, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getAIRecommendation } from '../services/geminiService';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      setLoadingAi(true);
      getAIRecommendation(product)
        .then(advice => setAiAdvice(advice))
        .finally(() => setLoadingAi(false));
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black mb-8">&larr; Back to Shop</button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 shadow-sm">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
               <img src={`https://picsum.photos/400/400?random=${product.id}1`} className="h-full w-full object-cover" alt="Detail 1" />
            </div>
             <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
               <img src={`https://picsum.photos/400/400?random=${product.id}2`} className="h-full w-full object-cover" alt="Detail 2" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-2xl text-gray-900 font-medium">${product.price}</span>
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"} />
              ))}
              <span className="text-gray-500 text-sm ml-2">({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* AI Section */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 relative overflow-hidden transition-all hover:shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} className="text-indigo-600" />
            </div>
            <h3 className="flex items-center text-indigo-900 font-semibold mb-2">
              <Sparkles size={18} className="mr-2 text-indigo-600" />
              AI Stylist Recommendation
            </h3>
            {loadingAi ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 bg-indigo-200 rounded"></div>
                  <div className="h-2 bg-indigo-200 rounded w-3/4"></div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-indigo-800 italic relative z-10">
                "{aiAdvice}"
              </p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-medium text-gray-900">Key Features:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4 mb-8">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-primary text-white px-8 py-4 rounded-md font-bold hover:bg-slate-800 transition-transform active:scale-95 shadow-lg shadow-blue-900/10"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-4 border rounded-md transition-colors ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-300 hover:bg-gray-50 text-gray-400'}`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
               <Heart size={24} className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>

          <div className="border-t pt-6 space-y-4 text-sm text-gray-500">
             <div className="flex items-center">
               <Truck size={18} className="mr-3 text-gray-400" />
               Free shipping on orders over $200
             </div>
             <div className="flex items-center">
               <Shield size={18} className="mr-3 text-gray-400" />
               2 year extended warranty included
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};