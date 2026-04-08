import type { Product } from "./product.type";

export interface Category {
    id: string;
    name: string;
}

export interface CategoryIncludeProducts extends Category {
    products: Product[];
}