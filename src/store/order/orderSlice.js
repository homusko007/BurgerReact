import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URI, POSTFIX } from "../../const.js";
import { calcTotal } from "../../utils/calc.js";

const initialState = {
  orderList: JSON.parse(localStorage.getItem("order") || "[]"),
  orderGoods: [],
  totalPrice: 0,
  totalCount: 0,
  error: "",
};

export const localStorageMiddleware = (store) => (next) => (action) => {
  const nextAction = next(action);

  if (nextAction.type.startsWith("order/")) {
    const orderList = store.getState().order.orderList;
    localStorage.setItem("order", JSON.stringify(orderList));
  }

  return nextAction;
};

// получаем с сервера данные о товарах по их id, которые добавили в orderList
export const orderRequestAsync = createAsyncThunk(
  "order/fetch",
  (_, { getState }) => {
    // _, т.к. getState это 2-й параметр, а 1-й нам не нужен
    const listId = getState().order.orderList.map((item) => item.id);

    return fetch(`${API_URI}${POSTFIX}?list=${listId}`)
      .then((req) => req.json())
      .catch((error) => ({ error }));
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const productOrderList = state.orderList.find(
        (item) => item.id === action.payload.id
      );

      if (productOrderList) {
        productOrderList.count += 1;

        const productOrderGoods = state.orderList.find(
          (item) => item.id === action.payload.id
        );
        productOrderGoods.count = productOrderList.count;
        [state.totalCount, state.totalPrice] = calcTotal(state.orderGoods);
      } else {
        state.orderList.push({ ...action.payload, count: 1 });
      }
    },
    removeProduct: (state, action) => {
      const productOrderList = state.orderList.find(
        (item) => item.id === action.payload.id
      );

      if (productOrderList.count > 1) {
        productOrderList.count -= 1;

        const productOrderGoods = state.orderList.find(
          (item) => item.id === action.payload.id
        );
        productOrderGoods.count = productOrderList.count;
        [state.totalCount, state.totalPrice] = calcTotal(state.orderGoods);
      } else {
        state.orderList = state.orderList.filter(
          (item) => item.id !== action.payload.id
        );
      }
    },
    clearOrder: (state) => {
      state.orderList = [];
      state.orderGoods = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderRequestAsync.pending, (state) => {
        state.error = "";
      })
      .addCase(orderRequestAsync.fulfilled, (state, action) => {
        const orderGoods = state.orderList.map((item) => {
          const product = action.payload.find(
            (product) => product.id === item.id
          );

          product.count = item.count;

          return product;
        });

        state.error = "";
        state.orderGoods = orderGoods;
        /* 1 способ
      state.totalCount = orderGoods.reduce((acc, item) => acc + item.count, 0);
      state.totalPrice = orderGoods.reduce((acc, item) => acc + item.count * item.price, 0);*/
        // 2-й способ
        [state.totalCount, state.totalPrice] = calcTotal(orderGoods);
      })
      .addCase(orderRequestAsync.rejected, (state) => {
        state.error = "error";
      });
  },
});

export const { addProduct, removeProduct, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
