import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import { customFetch } from "../../utilities/api";
import type { ResponseData, ResponseError } from "../../types/response.type";
import { useImmer } from "use-immer";
import type { TransactionIncludeOrder } from "../../types/transaction.type";
import type { OrderProduct } from "../../types/order.type";

export default function AdminTransaction(): React.JSX.Element {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [transactions, setTransactions] = useImmer<TransactionIncludeOrder[]>([])
    const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);
    const [orderProducts, setOrderProducts] = useImmer<OrderProduct[]>([]);
    const [searchString, setSearchString] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setError('');
        (async () => {
            try {
                const response = await customFetch(`/api/transactions?include=orders&date=${date}`);
                if (response.ok) {
                    const { data } = await response.json() as ResponseData<TransactionIncludeOrder[]>;
                    setTransactions(data);
                } else {
                    const { error } = await response.json() as ResponseError;
                    setError(error);
                }
            } catch (error) {
                setError('Gagal fetch data dari server');
            } finally {
                setLoading(false);
            }
        })()
    }, [date, setTransactions]);

    const openModalDetail = useCallback((transaction: TransactionIncludeOrder) => {
        setError('');
        setLoading(true);
        (async () => {
            try {
                const response = await customFetch(`/api/transactions/${transaction.id}/orders/${transaction.order.id}/details?include=products`);
                if (response.ok) {
                    const { data } = await response.json() as ResponseData<OrderProduct[]>;
                    setOrderProducts(data);
                    setIsOpenModalDetail(true);
                } else {
                    const { error } = await response.json() as ResponseError;
                    setError(error);
                }
            } catch (err) {
                setError('Gagal fetch product detail');
            } finally {
                setLoading(false);
            }
        })();
    }, [setOrderProducts]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => 
            t.order.orderNumber.toString().includes(searchString) || 
            t.paymentMethod.toLowerCase().includes(searchString.toLowerCase())
        );
    }, [transactions, searchString]);

    const stats = useMemo(() => {
        const totalAmount = filteredTransactions.reduce((acc, curr) => acc + Number(curr.totalCost), 0);
        return {
            count: filteredTransactions.length,
            revenue: totalAmount
        };
    }, [filteredTransactions]);

    return (
        <div className="min-h-screen bg-white pt-20 pb-12 px-4 md:px-8 relative">

            {/* Error */}
            {error && <ErrorBanner error={error} setError={setError} />}

            {/* Loading */}
            {loading && <LoadingOverlay />}

            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Transaction History</h1>
                    <p className="text-gray-500">Monitor and review all customer orders and payments.</p>
                </header>

                {/* Filters & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Search & Date Filter */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Search Order / Method</label>
                            <input 
                                type="text" 
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                                placeholder="e.g. 102 or QRIS"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C] transition-all"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Date</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C] font-bold text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-[#DA291C] p-6 rounded-xl shadow-xl shadow-red-100 flex justify-between items-center text-white">
                        <div>
                            <p className="text-red-200 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                            <h2 className="text-3xl font-black">Rp {stats.revenue.toLocaleString()}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-red-200 text-xs font-bold uppercase tracking-wider">Orders</p>
                            <h2 className="text-3xl font-black">{stats.count}</h2>
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Order #</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Trx Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Order Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-gray-700 text-center">#{transaction.order.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase text-center">
                                            {transaction.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#DA291C] text-center">Rp {Number(transaction.totalCost).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${transaction.status === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="text-sm font-medium text-gray-600">{transaction.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            transaction.order.status === 'COMPLETED' ? 'text-green-600 bg-green-50' : 
                                            transaction.order.status === 'ONGOING' ? 'text-yellow-600 bg-yellow-50' : 
                                            'text-red-600 bg-red-50'

                                        }`}>
                                            {transaction.order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => openModalDetail(transaction)}
                                            className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center">
                            <span className="text-5xl mb-4">📂</span>
                            <p className="text-gray-400 font-medium">No transactions found for this period.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail */}
            {isOpenModalDetail && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800">Order Items</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Reviewing transaction items</p>
                            </div>
                            <button onClick={() => setIsOpenModalDetail(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                ✕
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {orderProducts.map((op, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <img 
                                        src={op.product.imageUrl} 
                                        alt={op.product.name} 
                                        className="w-20 h-20 rounded-xl object-cover bg-gray-100 shadow-inner" 
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{op.product.name}</h4>
                                        <p className="text-sm text-gray-500">Rp {op.product.price.toLocaleString()} x {op.quantity}</p>
                                    </div>
                                    <p className="font-black text-gray-700">
                                        Rp {(op.product.price * op.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Grand Total</span>
                                <span className="text-2xl font-black text-[#DA291C]">
                                    Rp {orderProducts.reduce((sum, op) => sum + (op.product.price * op.quantity), 0).toLocaleString()}
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsOpenModalDetail(false)}
                                className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}