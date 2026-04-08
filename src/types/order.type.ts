import type { Product } from "./product.type";

export interface Order {
    id: string;
    orderNumber: number;
    status: string;
}

export interface OrderProduct {
    quantity: number;
    product: Product;
}
