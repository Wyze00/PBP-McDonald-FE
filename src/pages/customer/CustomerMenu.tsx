import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { CategoryIncludeProducts } from "../../types/category.type";
import type { Product } from "../../types/product.type";
import type { ResponseData, ResponseError } from "../../types/response.type";
import { useImmer } from "use-immer";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { addItem } from "../../redux/cart.slice";

export default function CustomerMenu(): React.JSX.Element {
    const [cip, setCip] = useImmer<CategoryIncludeProducts[]>([]);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cartItems = useAppSelector(state => state.cart.items);

    const cartTotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cartItems]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch public category data
                const response = await fetch('/api/categories?include=products');
                if (response.ok) {
                    const { data } = await response.json() as ResponseData<CategoryIncludeProducts[]>;
                    setCip(data);
                } else {
                    const { error } = await response.json() as ResponseError;
                    setError(error);
                }
            } catch (err) {
                setError("Gagal memuat data dari server.");
            } finally {
                setLoading(false);
            }
        })()
    }, [setCip]);

    const activeCategory = useMemo(() => cip[activeCategoryIndex], [cip, activeCategoryIndex]);

    const handleOpenProductModal = useCallback((product: Product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity
    }, []);

    const handleAddToCart = () => {
        if (selectedProduct) {
            dispatch(addItem({ product: selectedProduct, quantity }));
            setSelectedProduct(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white pb-24">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            <main className="flex-1 flex">
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <h2 className="font-black text-xl text-gray-800 uppercase tracking-tighter">Categories</h2>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4">
                        {cip.map((cat, index) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryIndex(index)}
                                className={`w-full text-left px-8 py-4 font-bold transition-all ${activeCategoryIndex === index ? 'bg-gray-50 border-r-4 border-[#DA291C] text-[#DA291C]' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </aside>

                <section className="flex-1 p-8 overflow-y-auto">
                    <h1 className="text-3xl font-black text-gray-800 mb-8">{activeCategory?.name || 'Menu'}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeCategory?.products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleOpenProductModal(product)}
                                className="group bg-white hover:rounded-xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-transparent"
                            >
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                                <p className="font-black text-[#DA291C]">Rp {product.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Product Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-xl bg-gray-100 mb-6" />
                        <h2 className="text-2xl font-black text-gray-800 mb-2">{selectedProduct.name}</h2>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{selectedProduct.description}</p>
                        <p className="font-black text-xl text-[#DA291C] mb-8">Rp {selectedProduct.price.toLocaleString()}</p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-l-xl">-</button>
                                <span className="px-4 font-bold w-12 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-r-xl">+</button>
                            </div>
                            <button onClick={handleAddToCart} className="flex-1 bg-[#DA291C] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#C82115] transition-all">
                                Add to Cart
                            </button>
                        </div>
                        <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-10 h-10 bg-white shadow-sm rounded-full font-bold text-gray-500 hover:text-red-500 flex items-center justify-center">✕</button>
                    </div>
                </div>
            )}

            {/* Hovering Cart Preview */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 z-40">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Cart Total ({cartItems.length} items)</span>
                            <span className="text-2xl font-black text-[#DA291C]">Rp {cartTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={() => navigate('/customer/cart')} className="bg-[#DA291C] text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#C82115] transition-all">
                            View Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}