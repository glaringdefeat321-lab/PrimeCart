import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const Shop = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) {
        setSelectedCategory(categoryParam);
    } else {
        setSelectedCategory('All');
    }
  }, [categoryParam]);

  const categories = ['All', 'Men', 'Women', 'Accessories'];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Filter
    if (searchParam) {
        const query = searchParam.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, priceRange, sortBy, searchParam]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // Preserve search param if exists, or just switch category? 
    // Usually switching category clears search, or searches within category.
    // Let's keep it simple: update category param.
    const newParams: any = { category: cat };
    if (searchParam) newParams.search = searchParam;
    if (cat === 'All') delete newParams.category;
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 1000]);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-gray-900">
               {searchParam ? `Results for "${searchParam}"` : 'Shop Collection'}
           </h1>
           <p className="text-gray-500 mt-2">
               {filteredProducts.length} items found 
               {searchParam && <button onClick={() => setSearchParams({})} className="ml-2 text-luxury text-sm hover:underline flex-inline items-center gap-1"><X size={12} /> Clear Search</button>}
           </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-luxury"
                >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
                <h3 className="font-semibold mb-4 flex items-center"><Filter size={16} className="mr-2"/> Categories</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="category" 
                                className="text-luxury focus:ring-luxury"
                                checked={selectedCategory === cat}
                                onChange={() => handleCategoryChange(cat)}
                            />
                            <span className="ml-2 text-gray-700">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="flex items-center space-x-2">
                    <input 
                        type="number" 
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                        type="number" 
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                </div>
            </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No products match your filters.</p>
                    <button onClick={clearFilters} className="mt-4 text-luxury hover:underline">Clear Filters</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};