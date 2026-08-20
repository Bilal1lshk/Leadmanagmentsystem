import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  initialized: boolean;
}

const initialState: AuthState = { user: null, initialized: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.initialized = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.initialized = true;
    },
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
