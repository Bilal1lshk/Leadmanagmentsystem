import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Lead {
  _id?: string;
  id?: string;
  personId?: string;
  name?: string;
  email?: string;
  assignedTo?: string;
  status?: string;
  priority?: string;
  source?: string;
  estimatedValue?: number;
  lastContactedAt?: string;
  createdAt?: string;
}

interface LeadState {
  Lead: Lead[];
}

const initialState: LeadState = {
  Lead: [],
};

const LeadSlice = createSlice({
  name: "Lead",
  initialState,
  reducers: {
    setAllLeads: (state, action: PayloadAction<Lead[]>) => {
      state.Lead = action.payload;
    },
  },
});

export const { setAllLeads } = LeadSlice.actions;
export default LeadSlice.reducer;
