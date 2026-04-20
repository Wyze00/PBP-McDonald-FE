import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { clearCart } from "../../redux/cart.slice";

export default function CustomerPayAtCashier(): React.JSX.Element {
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Modal & Payment States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<'CASH' | 'QRIS' | 'CARD' | null>(null);
    
    // Receipt & Countdown States
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [receiptData, setReceiptData] = useState<any | null>(null);
    const [receiptClosed, setReceiptClosed] = useState(false);
    const [countdown, setCountdown] = useState(5);
    
    const cartItems = useAppSelector(state => state.cart.items);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Trigger payment modal if there are items
    useEffect(() => {
        if (cartItems.length > 0 && !orderNumber) {
            setShowPaymentModal(true);
        }
    }, [cartItems, orderNumber]);

    // Handle the 5-second auto-redirect countdown
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (receiptClosed && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (receiptClosed && countdown === 0) {
            navigate('/customer');
        }
        return () => clearTimeout(timer);
    }, [receiptClosed, countdown, navigate]);

    const handleProcessPayment = async () => {
        if (!selectedPayment) return;
        
        setShowPaymentModal(false);
        setLoading(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: cartItems.map(item => ({
                        product_id: item.product.id,
                        quantity: item.quantity
                    })),
                    paymentMethod: selectedPayment
                })
            });

            if (response.ok) {
                const { data } = await response.json();
                setOrderNumber(String(data.orderNumber).padStart(2, '0'));
                dispatch(clearCart());

                const receiptResponse = await fetch(`/api/orders/${data.id}`);
                if (receiptResponse.ok) {
                    const receiptJson = await receiptResponse.json();
                    setReceiptData(receiptJson.data);
                }
            } else {
                console.error("Failed to create order.");
                setShowPaymentModal(true);
            }
        } catch (error) {
            console.error("Network error:", error);
            setShowPaymentModal(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-[#DA291C] border-t-transparent rounded-full animate-spin mb-8"></div>
                <h1 className="text-2xl font-black text-gray-800">Processing Your Payment...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 text-center bg-gray-50">
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-gray-800 mb-6">Select Payment Method</h2>
                        <div className="grid grid-cols-1 gap-4 mb-8">
                            {['CASH', 'QRIS', 'CARD'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setSelectedPayment(method as 'CASH' | 'QRIS' | 'CARD')}
                                    className={`w-full p-4 rounded-xl font-bold border-2 transition-all ${
                                        selectedPayment === method 
                                        ? 'border-[#DA291C] bg-red-50 text-[#DA291C]' 
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={handleProcessPayment}
                            disabled={!selectedPayment}
                            className="w-full bg-[#DA291C] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#C82115] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {receiptData && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
                    <div className="bg-white rounded-lg w-full max-w-sm p-8 shadow-2xl relative">
                        <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">MCDONALD'S</h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Order Receipt</p>
                            <div className="text-6xl font-black text-[#DA291C] mt-4">{String(receiptData.orderNumber).padStart(2, '0')}</div>
                        </div>
                        
                        <div className="space-y-4 mb-6 text-sm font-bold text-gray-600">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {receiptData.orderedProductsDetails.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-start gap-4">
                                    <div className="flex gap-2">
                                        <span className="text-gray-800">{item.quantity}x</span>
                                        <span>{item.product.name}</span>
                                    </div>
                                    <span className="text-gray-800 whitespace-nowrap">Rp {(item.quantity * item.product.price).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-t-2 border-dashed border-gray-300 pt-6 space-y-2">
                            <div className="flex justify-between font-black text-lg text-gray-800">
                                <span>TOTAL</span>
                                <span>Rp {receiptData.orderTransaction?.totalCost?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-sm text-gray-500">
                                <span>Payment Method</span>
                                <span>{receiptData.orderTransaction?.paymentMehthod}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setReceiptData(null);
                                setReceiptClosed(true); // Triggers the countdown
                            }} 
                            className="mt-8 w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-black hover:bg-gray-200 transition-all text-center"
                        >
                            Close Receipt
                        </button>
                    </div>
                </div>
            )}

            {/* Success Background View */}
            <div className="bg-white p-16 rounded-[2rem] shadow-xl w-full max-w-2xl border border-gray-100 flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4">Your Order Number Is</h2>
                <div className="text-9xl font-black text-gray-800 mb-8">{orderNumber || '--'}</div>
                <p className="text-lg font-bold text-gray-500 max-w-xs mx-auto leading-relaxed mb-8">
                    Please Take The Printed Order Details and Proceed to A Cashier
                </p>

                {/* Auto-Redirect Button (Visible after receipt closes) */}
                {receiptClosed && (
                    <button 
                        onClick={() => navigate('/customer')}
                        className="w-full max-w-xs bg-[#DA291C] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#C82115] transition-all"
                    >
                        Return to Menu ({countdown}s)
                    </button>
                )}
            </div>
        </div>
    );
}