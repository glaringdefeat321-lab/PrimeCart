import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, DollarSign, TrendingUp, Plus, Trash2, Edit2, Zap, X, Check, Home } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole, Product } from '../types';
import { getAdminProductInsight } from '../services/geminiService';

export const AdminDashboard = () => {
  const { user, products, orders, deleteProduct, addProduct, login } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');
  const [aiInsight, setAiInsight] = useState("Generating catalog insights...");
  
  // State for Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Men',
    price: 0,
    stock: 0,
    description: '',
    image: '',
  });

  // --- AUTOMATED STATS CALCULATION ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    // Simple unique customer count based on orders (in a real app, track user IDs)
    const activeCustomers = totalOrders > 0 ? 1 + Math.floor(totalOrders * 0.8) : 0; 
    
    return {
        totalRevenue,
        totalOrders,
        activeCustomers,
        growth: totalOrders > 0 ? 100 : 0 // Simple mock growth
    };
  }, [orders]);

  // --- AUTOMATED CHART DATA ---
  const chartData = useMemo(() => {
    if (orders.length === 0) return [];
    
    // Group orders by Month (simplified for demo)
    const dataMap: Record<string, number> = {};
    
    orders.forEach(order => {
        const date = new Date(order.date);
        const month = date.toLocaleString('default', { month: 'short' });
        dataMap[month] = (dataMap[month] || 0) + order.total;
    });

    return Object.entries(dataMap).map(([name, sales]) => ({ name, sales }));
  }, [orders]);


  useEffect(() => {
     if (user?.role === UserRole.ADMIN && activeTab === 'overview') {
         getAdminProductInsight(products).then(setAiInsight);
     }
  }, [user, activeTab, products]);

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
        alert("Please enter at least a name and price");
        return;
    }

    const productToAdd: Product = {
        id: Date.now().toString(),
        name: newProduct.name || 'New Product',
        price: Number(newProduct.price) || 0,
        category: newProduct.category || 'Men',
        image: newProduct.image || `https://picsum.photos/400/500?random=${Math.floor(Math.random() * 1000)}`,
        description: newProduct.description || 'No description provided.',
        rating: 5.0,
        reviews: 0,
        stock: Number(newProduct.stock) || 0,
        features: ['New Arrival', 'Premium Quality']
    };

    addProduct(productToAdd);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', category: 'Men', price: 0, stock: 0, description: '', image: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block flex-shrink-0 h-screen sticky top-0 flex flex-col justify-between">
        <div>
            <h2 className="text-xl font-serif font-bold mb-8">Admin Portal</h2>
            <nav className="space-y-2">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-luxury text-slate-900' : 'text-gray-400 hover:bg-slate-800'}`}
                >
                    <TrendingUp size={20} />
                    <span>Overview</span>
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-luxury text-slate-900' : 'text-gray-400 hover:bg-slate-800'}`}
                >
                    <Package size={20} />
                    <span>Products</span>
                </button>
                 <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-slate-800 transition-colors">
                    <Users size={20} />
                    <span>Customers</span>
                </button>
            </nav>
        </div>

        {/* Exit Admin Button */}
        <button 
            onClick={() => login(UserRole.CUSTOMER)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors border-t border-slate-800 pt-6 mt-4"
        >
            <Home size={20} />
            <span>Return to Shop</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' ? (
            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm">Total Revenue</span>
                            <span className="p-2 bg-green-100 text-green-600 rounded-full"><DollarSign size={16} /></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Based on {stats.totalOrders} sales</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm">Total Orders</span>
                            <span className="p-2 bg-blue-100 text-blue-600 rounded-full"><Package size={16} /></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm">Active Customers</span>
                            <span className="p-2 bg-purple-100 text-purple-600 rounded-full"><Users size={16} /></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-sm text-white">
                        <div className="flex items-center mb-2">
                             <Zap size={18} className="text-yellow-300 mr-2" />
                             <span className="font-semibold">AI Insight</span>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed text-indigo-100">
                            {aiInsight}
                        </p>
                    </div>
                </div>

                {/* Charts */}
                {stats.totalOrders > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Revenue Overview</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip 
                                        cursor={{fill: '#f3f4f6'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Bar dataKey="sales" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Sales Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip 
                                         contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Line type="monotone" dataKey="sales" stroke="#0f172a" strokeWidth={3} dot={{r: 4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                        <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                            <TrendingUp size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Sales Data Yet</h3>
                        <p className="text-gray-500 mt-2">Sales charts will appear automatically when customers place orders.</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <Plus size={18} className="mr-2" /> Add Product
                    </button>
                </div>

                {products.length === 0 ? (
                     <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                        <h3 className="text-lg font-medium text-gray-900">Your Catalog is Empty</h3>
                        <p className="text-gray-500 mt-2 mb-6">Add your first product to start selling.</p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-luxury text-primary font-bold px-6 py-3 rounded-lg inline-flex items-center"
                        >
                            <Plus size={18} className="mr-2" /> Add First Product
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Product</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Category</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Price</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Stock</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{product.category}</td>
                                        <td className="p-4 text-gray-900">${product.price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input 
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury focus:border-transparent outline-none"
                                placeholder="e.g., Cashmere Scarf"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input 
                                    type="number"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury focus:border-transparent outline-none"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input 
                                    type="number"
                                    name="stock"
                                    value={newProduct.stock}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury focus:border-transparent outline-none"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select 
                                name="category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury focus:border-transparent outline-none"
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea 
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury focus:border-transparent outline-none"
                                rows={3}
                                placeholder="Product description..."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                            <input 
                                name="image"
                                value={newProduct.image}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury focus:border-transparent outline-none"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty for a random image.</p>
                        </div>
                        
                        <div className="pt-4 flex justify-end space-x-3">
                            <button 
                                type="button" 
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-6 py-2 bg-luxury text-slate-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center shadow-md"
                            >
                                <Check size={18} className="mr-2" /> Save Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};