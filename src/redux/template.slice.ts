import { createSlice } from "@reduxjs/toolkit";
import type { Template } from "../types/template.type";

const initialState: Template = '';

type TemplateSliceAction = {
    type: string,
    payload: Template | undefined
}

export const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        setState: (_, action: TemplateSliceAction) => {
            return action.payload;
        } 
    }
})
