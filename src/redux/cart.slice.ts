import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderProduct } from "../types/order.type";
import type { Product } from "../types/product.type";

interface CartState {
    items: OrderProduct[];
}

const initialState: CartState = {
    items: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
            const existingItem = state.items.find(item => item.product.id === action.payload.product.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.items.find(item => item.product.id === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.product.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;