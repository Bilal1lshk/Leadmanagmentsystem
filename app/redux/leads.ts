import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type LeadPriority = "low" | "medium" | "high";
export type LeadSource = "website" | "referral" | "ad" | "cold_call" | "other";

export interface Lead {
  _id?: string;
  id?: string;
  organization?: string;
  personId?: string;
  name?: string;
  sourcedby?: string;
  source?: LeadSource;
  message?: string;
  phone?: string;
  email?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValue?: number;
  assignedTo?: string | null;
  lastContactedAt?: string | Date | null;
  lostReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
