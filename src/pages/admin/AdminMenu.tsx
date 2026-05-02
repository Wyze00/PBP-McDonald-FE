import { useCallback, useEffect, useMemo, useState } from "react";
import type { Category, CategoryIncludeProducts } from "../../types/category.type";
import type { Product } from "../../types/product.type";
import type { ResponseData, ResponseError } from "../../types/response.type";
import { useImmer } from "use-immer";
import { customFetch } from "../../utilities/api";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function AdminMenu(): React.JSX.Element {
    const [cip, setCip] = useImmer<CategoryIncludeProducts[]>([]);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useImmer<Product>({
        id: '',
        name: '',
        description: '',
        imageUrl: '',
        price: 0,
        categoryId: '',
    });

    const [selectedCategory, setSelectedCategory] = useImmer<Category>({
        id: '',
        name: '',
        endDate: '',
        endTime: '',
        startDate: '',
        startTime: '',
    });

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                const response = await customFetch('/api/categories?include=products');

                if (response.ok) {
                    const { data } = await response.json() as ResponseData<CategoryIncludeProducts[]>;
                    console.log(data);
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

    const activeCategory = useMemo(() => {
        return cip[activeCategoryIndex];
    }, [cip, activeCategoryIndex]);

    const handleOpenProductModal = useCallback((product: Product | null = null) => {
        setError('');

        if (product == null) {
            setSelectedProduct({
                id: '',
                name: '',
                description: '',
                imageUrl: '',
                price: 0,
                categoryId: '',
            })
        } else {
            setSelectedProduct(product);
        }

        setIsProductModalOpen(true);
    }, []);

    const handleOpenCategoryModal = useCallback((category: Category | null = null) => {
        setError('');

        if (category === null) {
            setSelectedCategory({
                id: '',
                name: '',
                endDate: '',
                endTime: '',
                startDate: '',
                startTime: '',
            })
        } else {
            setSelectedCategory({
                ...category,
                startDate: category.startDate ? new Date(category.startDate).toISOString().split('T')[0] : null,
                endDate: category.endDate ? new Date(category.endDate).toISOString().split('T')[0] : null,
                startTime: category.startTime ? new Date(category.startTime).toTimeString().slice(0, 5) : null,
                endTime: category.endTime ? new Date(category.endTime).toTimeString().slice(0, 5) : null,
            });
        }

        setIsCategoryModalOpen(true);
    }, []);

    const handleSaveCategory = useCallback((category: Category) => {
        setError('');

        const hasStartDate = Boolean(category.startDate);
        const hasEndDate = Boolean(category.endDate);

        if (hasStartDate !== hasEndDate) {
            setError('Start Date and End Date must either be both set or both empty.');
            return; // Stop execution
        }

        const hasStartTime = Boolean(category.startTime);
        const hasEndTime = Boolean(category.endTime);

        if (hasStartTime !== hasEndTime) {
            setError('Start Time and End Time must either be both set or both empty.');
            return; // Stop execution
        }

        setLoading(true);

        if (category.id === '') {

            (async () => {
                try {
                    const response = await customFetch(`/api/categories`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'Application/json'
                        },
                        body: JSON.stringify({
                            name: category.name,
                            startDate: category.startDate || null,
                            endDate: category.endDate || null,
                            startTime: category.startTime || null,
                            endTime: category.endTime || null,
                        }),
                        credentials: 'include',
                    })

                    if (response.ok) {
                        const { data } = await response.json() as ResponseData<Category>;

                        setCip((draft) => {
                            draft.push(
                                {
                                    ...data,
                                    products: [],
                                }
                            )
                        })

                    } else {
                        const { error } = await response.json() as ResponseError;
                        setError(error);
                    }

                } catch (error) {
                    setError('Gagal create data category');
                } finally {
                    setLoading(false);
                }
            })()

        } else {

            (async () => {
                try {
                    const response = await customFetch(`/api/categories/${category.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'Application/json'
                        },
                        body: JSON.stringify({
                            name: category.name,
                            startDate: category.startDate || null,
                            endDate: category.endDate || null,
                            startTime: category.startTime || null,
                            endTime: category.endTime || null,
                        }),
                        credentials: 'include',
                    })

                    if (response.ok) {
                        const { data } = await response.json() as ResponseData<Category>;

                        setCip((draft) => {

                            const index = draft.findIndex((category) => {
                                return category.id === data.id;
                            });

                            draft[index].name = data.name;
                            draft[index].startDate = data.startDate;
                            draft[index].endDate = data.endDate;
                            draft[index].startTime = data.startTime;
                            draft[index].endTime = data.endTime;
                        })
                    } else {
                        const { error } = await response.json() as ResponseError;
                        setError(error);
                    }

                } catch (error) {
                    setError('Gagal update data category');
                } finally {
                    setLoading(false);
                }
            })()
        }

        setIsCategoryModalOpen(false);
    }, []);

    const handleDeleteCategory = useCallback((category: Category) => {
        setError('');
        setLoading(true);

        (async () => {
            try {
                const response = await customFetch(`/api/categories/${category.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })

                if (response.ok) {
                    setCip((draft) => {
                        const index = draft.findIndex((draftCategory) => {
                            return category.id === draftCategory.id;
                        });

                        draft.splice(index, 1);
                    })

                } else {
                    const { error } = await response.json() as ResponseError;
                    setError(error);
                }

            } catch (error) {
                setError('Gagal menghapus data category');
            } finally {
                setLoading(false);
            }
        })()

        setIsCategoryModalOpen(false);
    }, []);

    const handleSaveProduct = useCallback((product: Product, categoryIndex: number) => {
        setError('');
        setLoading(true);

        if (product.id === '') {

            (async () => {
                try {
                    const response = await customFetch(`/api/products`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'Application/json'
                        },
                        body: JSON.stringify({
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            imageUrl: product.imageUrl,
                            categoryId: cip[categoryIndex].id
                        }),
                        credentials: 'include',
                    })

                    if (response.ok) {
                        const { data } = await response.json() as ResponseData<Product>;

                        setCip((draft: CategoryIncludeProducts[]) => {
                            const index = draft.findIndex((category) => {
                                return category.id === data.categoryId;
                            });

                            draft[index].products.push({
                                id: data.id,
                                name: data.name,
                                price: data.price,
                                description: data.description,
                                imageUrl: data.imageUrl,
                                categoryId: data.categoryId,
                            })
                        })

                    } else {
                        const { error } = await response.json() as ResponseError;
                        setError(error);
                    }

                } catch (error) {
                    console.log(error);
                    setError('Gagal create data product');
                } finally {
                    setLoading(false);
                }
            })()

        } else {
            (async () => {
                try {
                    const response = await customFetch(`/api/products/${product.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'Application/json'
                        },
                        body: JSON.stringify({
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            imageUrl: product.imageUrl,
                            categoryId: cip[categoryIndex].id,
                        }),
                        credentials: 'include',
                    })

                    if (response.ok) {
                        const { data } = await response.json() as ResponseData<Product>;

                        setCip((draft: CategoryIncludeProducts[]) => {

                            const index = draft.findIndex((category) => {
                                return category.id === data.categoryId;
                            });

                            const productIndex = draft[index].products.findIndex((draftProduct) => {
                                return draftProduct.id === data.id;
                            })

                            draft[index].products[productIndex] = {
                                id: data.id,
                                name: data.name,
                                price: data.price,
                                description: data.description,
                                imageUrl: data.imageUrl,
                                categoryId: data.categoryId,
                            };
                        })
                    } else {
                        const { error } = await response.json() as ResponseError;
                        setError(error);
                    }

                } catch (error) {
                    console.log(error);
                    setError('Gagal update data category');
                } finally {
                    setLoading(false);
                }
            })()
        }

        setIsProductModalOpen(false);
    }, [cip])

    const handleDeleteProduct = useCallback((product: Product) => {
        setError('');
        setLoading(true);

        (async () => {
            try {
                const response = await customFetch(`/api/products/${product.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })

                if (response.ok) {
                    setCip((draft: CategoryIncludeProducts[]) => {
                        const index = draft.findIndex((category) => {
                            return category.id === product.categoryId;
                        });

                        const productIndex = draft[index].products.findIndex((draftProduct) => {
                            return draftProduct.id === product.id;
                        })
                        console.log(draft[index].products[productIndex]);
                        draft[index].products.splice(productIndex, 1);
                    })
                } else {
                    const { error } = await response.json() as ResponseError;
                    setError(error);
                }
            } catch (error) {
                setError('Gagal menghapus data product');
            } finally {
                setLoading(false);
            }
        })()

        setIsProductModalOpen(false);
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-white">

            {/* Error */}
            {error && <ErrorBanner error={error} setError={setError} />}

            {/* Loading */}
            {loading && <LoadingOverlay />}

            <main className="flex-1 flex">
                {/* Categories */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <h2 className="font-black text-xl text-gray-800 uppercase tracking-tighter">Categories</h2>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4">
                        {cip.map((cat, index) => (
                            <div key={cat.id} className="group flex items-center px-4">
                                <button
                                    onClick={() => setActiveCategoryIndex(index)}
                                    className={`flex-1 text-left px-4 py-3 rounded-xl font-bold transition-all ${activeCategoryIndex === index
                                        ? 'text-[#FFC72C]'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                                <button
                                    onClick={() => handleOpenCategoryModal(cat)}
                                    className="ml-2 p-2 opacity-0 group-hover:opacity-100 text-xs bg-gray-200 rounded-md hover:bg-gray-300 transition"
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </nav>
                    <button
                        onClick={() => handleOpenCategoryModal(null)}
                        className="m-4 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-[#DA291C] hover:text-[#DA291C] transition-all"
                    >
                        + Add Category
                    </button>
                </aside>

                {/* Products */}
                <section className="flex-1 p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-black text-gray-800">{activeCategory?.name || 'Menu'}</h1>
                    </div>

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
                                <h3 className="font-bold text-gray-800 text-lg m-auto">{product.name}</h3>
                                <p className="font-black text-[#DA291C]">Rp {product.price.toLocaleString()}</p>
                            </div>
                        ))}

                        {/* Add Product Card */}
                        <button
                            onClick={() => handleOpenProductModal(null)}
                            className="aspect-square flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-xl text-gray-300 hover:text-[#DA291C] hover:border-[#DA291C] transition-all"
                        >
                            <span className="text-6xl font-light">+</span>
                            <span className="font-bold uppercase tracking-widest text-xs mt-2">Add Product</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-md w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                        <h2 className="text-2xl font-black mb-6 text-gray-800">{selectedProduct.id ? 'Update Item' : 'New Menu Item'}</h2>
                        <div className="space-y-4">
                            <label htmlFor="imageUrl">Image URL</label>
                            <input type="text" onChange={(e) => setSelectedProduct((draft) => { draft.imageUrl = e.target.value })} id="imageUrl" placeholder="imageUrl" defaultValue={selectedProduct?.imageUrl} className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]" />
                            <label htmlFor="name">Name</label>
                            <input type="text" onChange={(e) => setSelectedProduct((draft) => { draft.name = e.target.value })} id="name" placeholder="Name" defaultValue={selectedProduct?.name} className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]" />
                            <label htmlFor="price">Price</label>
                            <input type="number" onChange={(e) => setSelectedProduct((draft) => { draft.price = Number(e.target.value) })} id="price" placeholder="Price" defaultValue={selectedProduct?.price} className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]" />
                            <label htmlFor="descriptioon">Description</label>
                            <textarea id="description" onChange={(e) => setSelectedProduct((draft) => { draft.description = e.target.value })} placeholder="Description" defaultValue={selectedProduct?.description} className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C] h-24" />

                            <div className="flex justify-between items-center mt-8 gap-4">
                                {selectedProduct && (
                                    <button type="button" onClick={() => handleDeleteProduct(selectedProduct)} className="text-red-500 font-bold hover:underline text-sm">Delete Item</button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 font-bold text-gray-400">Cancel</button>
                                    <button type="submit" onClick={() => handleSaveProduct(selectedProduct, activeCategoryIndex)} className="px-8 py-3 bg-[#DA291C] text-white rounded-full font-bold shadow-lg shadow-red-200">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-md w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-black mb-6 text-gray-800">{selectedCategory.id ? 'Edit Category' : 'New Category'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    onChange={(e) => setSelectedCategory((draft) => { draft.name = e.target.value })}
                                    placeholder="Category Name"
                                    defaultValue={selectedCategory?.name}
                                    className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        onChange={(e) => setSelectedCategory((draft) => { draft.startDate = e.target.value || null })}
                                        defaultValue={selectedCategory?.startDate || ''}
                                        className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        onChange={(e) => setSelectedCategory((draft) => { draft.endDate = e.target.value || null })}
                                        defaultValue={selectedCategory?.endDate || ''}
                                        className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-sm font-bold text-gray-700">Time Period</label>

                                    {/* CLEAR BUTTON LOGIC */}
                                    {(selectedCategory.startTime || selectedCategory.endTime) && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCategory(draft => {
                                                draft.startTime = null;
                                                draft.endTime = null;
                                            })}
                                            className="text-xs text-red-500 font-bold hover:underline"
                                        >
                                            Clear Time
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="time"
                                            id="startTime"
                                            onChange={(e) => setSelectedCategory((draft) => { draft.startTime = e.target.value || null })}
                                            value={selectedCategory?.startTime || ''} /* CHANGED FROM defaultValue */
                                            className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="time"
                                            id="endTime"
                                            onChange={(e) => setSelectedCategory((draft) => { draft.endTime = e.target.value || null })}
                                            value={selectedCategory?.endTime || ''}  /* CHANGED FROM defaultValue */
                                            className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8 gap-4">
                                {selectedCategory.id && (
                                    <button type="button" onClick={() => handleDeleteCategory(selectedCategory)} className="text-red-500 font-bold hover:underline text-sm">Delete</button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-3 font-bold text-gray-400">Cancel</button>
                                    <button type="submit" onClick={() => handleSaveCategory(selectedCategory)} className="px-8 py-3 bg-[#DA291C] text-white rounded-full font-bold">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}