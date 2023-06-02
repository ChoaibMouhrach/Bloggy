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
      // eslint-disable-next-line no-param-reassign
      state.value = [...state.value, ...payload];
    },
    removeAlert: (state, { payload }: { payload: number }) => {
      // eslint-disable-next-line no-param-reassign
      state.value = state.value.filter((alert) => alert.id !== payload);
    },
  },
});

export const getAlerts = (state: { toast: { value: IAlert[] } }) =>
  state.toast.value;
export const { addAlerts, removeAlert } = toastSlice.actions;
export default toastSlice.reducer;
