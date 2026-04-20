import { useNavigate } from "react-router";

export default function CustomerOrderCompletion(): React.JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-xl w-full max-w-3xl text-center">
                <h1 className="text-3xl font-black text-gray-800 mb-10">Choose How You Want to Complete Your Order</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => navigate('/customer/cart/order-completion/pay-at-machine')}
                        className="h-56 bg-gray-50 rounded-3xl flex flex-col items-center justify-center p-6 border-4 border-transparent hover:border-[#DA291C] hover:bg-red-50 transition-all group shadow-sm"
                    >
                        <span className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">💳</span>
                        <h2 className="text-2xl font-black text-gray-800 group-hover:text-[#DA291C]">Pay Here</h2>
                        <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">(QRIS & Card)</p>
                    </button>

                    <button 
                        onClick={() => navigate('/customer/cart/order-completion/pay-at-cashier')}
                        className="h-56 bg-gray-50 rounded-3xl flex flex-col items-center justify-center p-6 border-4 border-transparent hover:border-[#DA291C] hover:bg-red-50 transition-all group shadow-sm"
                    >
                        <span className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">💵</span>
                        <h2 className="text-2xl font-black text-gray-800 group-hover:text-[#DA291C]">Pay At Cashier</h2>
                        <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">(Cash, QRIS, & Card)</p>
                    </button>
                </div>
            </div>
        </div>
    );
}