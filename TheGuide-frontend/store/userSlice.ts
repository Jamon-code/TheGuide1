import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  image: string | null;
  facebookId: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  name: null,
  email: null,
  image: null,
  facebookId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.facebookId = action.payload.facebookId;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
      state.image = null;
      state.facebookId = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;