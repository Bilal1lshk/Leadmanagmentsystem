import leadReducer from "./leads";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    LeadSlice: leadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;