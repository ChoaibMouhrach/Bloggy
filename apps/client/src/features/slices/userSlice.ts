import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/index";

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
      // eslint-disable-next-line no-param-reassign
      state.value = payload;
      localStorage.accessToken = payload.accessToken;
      localStorage.refreshToken = payload.refreshToken;
    },
    removeUser: (state) => {
      // eslint-disable-next-line no-param-reassign
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
