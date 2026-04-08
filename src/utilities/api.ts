// src/utils/api.ts
import { store } from '../redux/store';
import { userSlice } from '../redux/user.slice';

export const customFetch = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        ...options,
        credentials: 'include',
    };

    const response = await fetch(url, defaultOptions);

    if (response.status === 401) {
        store.dispatch(userSlice.actions.resetState());

        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        
        throw new Error("Session expired. Redirecting to login...");
    }

    return response;
};