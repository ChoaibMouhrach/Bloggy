import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import userSlice from "@/features/User/user.slice";
import toastSlice from "@/features/Toast/toast.slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    toast: toastSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
