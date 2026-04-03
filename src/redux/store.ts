import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user.slice";

export const store = configureStore({
    reducer: {
        template: userSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;