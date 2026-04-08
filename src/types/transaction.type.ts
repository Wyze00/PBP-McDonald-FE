import type { Order } from "./order.type";

export interface Transaction {
    id: string;
    paymentMethod: string;
    totalCost: string;
    status: string;
}

export interface TransactionIncludeOrder extends Transaction {
    order: Order;
}