import leadReducer from "./leads";
import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./tasks";
import organizationSlice from "./organization";
export const store = configureStore({
  reducer: {
    LeadSlice: leadReducer,
    tasksSlice,
    organizationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 