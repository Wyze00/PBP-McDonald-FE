import type { User } from "./user.type";

export interface LoginResponse {
    data?: User,
    error?: string;
}