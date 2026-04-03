import { configureStore } from "@reduxjs/toolkit";
import { templateSlice } from "./template.slice";

export const store = configureStore({
    reducer: {
        template: templateSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;