import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URI, POSTFIX } from "../../const.js";

const initialState = {
  products: [],
  load: false,
  error: "",
};

export const productRequestAsync = createAsyncThunk(
  "product/fetch",
  (category) =>
    fetch(`${API_URI}${POSTFIX}?category=${category}`)
      .then((req) => req.json())
      .catch((error) => ({ error }))
);

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(productRequestAsync.pending, state => {
        state.error = '';
        state.load = true;
    })
    .addCase(productRequestAsync.fulfilled, (state, action) => {
        state.error = '';
        state.load = false;
        state.products = action.payload;
    })
    .addCase(productRequestAsync.rejected, state => {
        state.error = 'action.payload.error';
        state.load = false;
    })
  },
});


export default productSlice.reducer;