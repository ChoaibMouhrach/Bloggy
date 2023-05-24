import { createSlice } from "@reduxjs/toolkit";
import { IAlert } from "ui";

const initialState: { value: IAlert[] } = {
  value: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addAlerts: (state, { payload }: { payload: IAlert[] }) => {
      state.value = [...state.value, ...payload];
    },
  },
});

export const getAlerts = (state: { toast: { value: IAlert[] } }) =>
  state.toast.value;
export const { addAlerts } = toastSlice.actions;
export default toastSlice.reducer;
