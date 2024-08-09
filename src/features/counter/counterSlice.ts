import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  value: number;
  lastChange: string;
};

const initialState: State = {
  value: 0,
  lastChange: "",
};

const counterSlice = createSlice({
  name: "counter",
  initialState: initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
      state.lastChange = action.type;
    },
  },
});

export const { increment, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
