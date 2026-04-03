import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/user.type";

const initialState: User = {
    username: '',
    role: '',
};

type UserSliceAction = {
    type: string,
    payload: User | undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setState: (_, action: UserSliceAction) => {
            return action.payload;
        } 
    },
    selectors: {
        getRole: (state: User) => {
            return state.role;
        }
    }
})
