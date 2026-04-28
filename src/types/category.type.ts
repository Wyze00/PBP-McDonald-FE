import type { Product } from "./product.type";

export interface Category {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
}

export interface CategoryIncludeProducts extends Category {
    products: Product[];
}