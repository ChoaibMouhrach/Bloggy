import { IUser } from "@/index";
import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  value: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  } | null;
}

const initialState: InitialState = {
  value: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      { payload }: { payload: NonNullable<typeof initialState.value> }
    ) => {
      state.value = payload;
      localStorage["accessToken"] = payload.accessToken;
      localStorage["refreshToken"] = payload.refreshToken;
    },
    removeUser: (state) => {
      state.value = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const getUser = (state: { user: InitialState }) =>
  state.user.value?.user;
export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
