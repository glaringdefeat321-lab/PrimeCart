import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard } from 'lucide-react';

export const Checkout = () => {
    const { cart, user, placeOrder } = useStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.name.split(' ')[0] || '',
        lastName: user?.name.split(' ')[1] || '',
        address: '',
        city: '',
        postalCode: ''
    });

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 25;
    const total = subtotal + shipping;

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.address || !formData.city) {
            alert("Please fill in your shipping details.");
            return;
        }

        setIsProcessing(true);
        
        // Simulate API/Stripe processing time
        setTimeout(() => {
            placeOrder(formData);
            setIsProcessing(false);
            alert('Order Placed Successfully! It will now appear in the Admin Dashboard.');
            navigate('/');
        }, 1500);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="text-luxury hover:underline">
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Forms */}
                <div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                             <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                             <form className="grid grid-cols-2 gap-4">
                                 <input name="firstName" onChange={handleInput} value={formData.firstName} type="text" placeholder="First Name" className="border p-2 rounded" required />
                                 <input name="lastName" onChange={handleInput} value={formData.lastName} type="text" placeholder="Last Name" className="border p-2 rounded" required />
                                 <input name="address" onChange={handleInput} value={formData.address} type="text" placeholder="Address" className="col-span-2 border p-2 rounded" required />
                                 <input name="city" onChange={handleInput} value={formData.city} type="text" placeholder="City" className="border p-2 rounded" required />
                                 <input name="postalCode" onChange={handleInput} value={formData.postalCode} type="text" placeholder="Postal Code" className="border p-2 rounded" required />
                             </form>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                             <h2 className="text-lg font-semibold mb-4 flex items-center">
                                 <CreditCard size={20} className="mr-2"/> Payment Method
                             </h2>
                             <div className="space-y-4">
                                 <div className="border rounded p-3 flex items-center bg-gray-50 border-luxury">
                                     <div className="h-4 w-4 rounded-full border border-luxury bg-luxury mr-3"></div>
                                     <span className="font-medium">Credit Card (Stripe Test)</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none">
                                      <input type="text" placeholder="Card Number" className="col-span-2 border p-2 rounded" defaultValue="4242 4242 4242 4242" />
                                      <input type="text" placeholder="MM/YY" className="border p-2 rounded" defaultValue="12/25" />
                                      <input type="text" placeholder="CVC" className="border p-2 rounded" defaultValue="123" />
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-8 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                <span className="font-medium">${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                         <div className="flex justify-between text-gray-600">
                             <span>Subtotal</span>
                             <span>${subtotal}</span>
                         </div>
                         <div className="flex justify-between text-gray-600">
                             <span>Shipping</span>
                             <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                         </div>
                         <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                             <span>Total</span>
                             <span>${total}</span>
                         </div>
                    </div>
                    
                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full mt-8 bg-primary text-white py-4 rounded font-bold hover:bg-slate-800 flex justify-center items-center transition-all"
                    >
                        {isProcessing ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <>
                                <ShieldCheck size={20} className="mr-2" /> Pay ${total}
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Secure 256-bit SSL encrypted payment.
                    </p>
                </div>
            </div>
        </div>
    );
};