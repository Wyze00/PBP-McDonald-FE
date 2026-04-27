import { useNavigate } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { updateQuantity, removeItem } from "../../redux/cart.slice";

export default function CustomerCart(): React.JSX.Element {
    const cartItems = useAppSelector(state => state.cart.items);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const subTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const tax = subTotal * 0.11; // Standard 11% Tax
    const total = subTotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-32 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-gray-800 uppercase mb-8">Your Cart</h1>
                
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                    {cartItems.map(item => (
                        <div key={item.product.id} className="flex items-center gap-6 py-6 border-b border-gray-100 last:border-0">
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50 shadow-inner" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">Rp {item.product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                    <button onClick={() => dispatch(updateQuantity({productId: item.product.id, quantity: Math.max(1, item.quantity - 1)}))} className="px-4 py-1 font-bold text-gray-600 hover:bg-gray-100">-</button>
                                    <span className="px-3 font-bold w-10 text-center">{item.quantity}</span>
                                    <button onClick={() => dispatch(updateQuantity({productId: item.product.id, quantity: item.quantity + 1}))} className="px-4 py-1 font-bold text-gray-600 hover:bg-gray-100">+</button>
                                </div>
                                <button onClick={() => dispatch(removeItem(item.product.id))} className="text-xs font-bold text-red-500 hover:underline px-2">Remove</button>
                            </div>
                            <div className="w-32 text-right">
                                <p className="font-black text-lg text-gray-800">Rp {(item.product.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {cartItems.length === 0 && (
                        <div className="text-center py-12 text-gray-400 font-bold text-lg">Your cart is empty.</div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 z-40">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-4 w-full md:w-auto">
                        <button onClick={() => navigate('/customer')} className="flex-1 md:flex-none px-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-all text-center">
                            Order More
                        </button>
                        <button onClick={() => navigate('/customer/cart/order-completion')} disabled={cartItems.length === 0} className="flex-1 md:flex-none px-8 py-3 bg-[#DA291C] text-white font-bold rounded-xl hover:bg-[#C82115] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center shadow-lg shadow-red-200">
                            Complete Order
                        </button>
                    </div>
                    <div className="w-full md:w-auto grid grid-cols-2 gap-x-8 gap-y-1 text-sm md:text-base">
                        <span className="text-gray-500 font-bold text-right">Sub Total</span>
                        <span className="font-bold text-gray-800 text-right">Rp {subTotal.toLocaleString()}</span>
                        <span className="text-gray-500 font-bold text-right">Tax (11%)</span>
                        <span className="font-bold text-gray-800 text-right">Rp {tax.toLocaleString()}</span>
                        <span className="text-gray-800 font-black text-right text-lg mt-1">Total</span>
                        <span className="font-black text-[#DA291C] text-right text-lg mt-1">Rp {total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}