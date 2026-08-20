import leadReducer from "./leads";
import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./tasks";
import organizationSlice from "./organization";
import authSlice from "./auth";
export const store = configureStore({
  reducer: {
    LeadSlice: leadReducer,
    tasksSlice,
    organizationSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
