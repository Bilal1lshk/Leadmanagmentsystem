import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Organization {
  _id: string;
  name: string;
  companysize: string;
  plan: string;
  role?: string;
}

interface OrganizationState {
  activeOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
}

const initialState: OrganizationState = {
  activeOrganization: null,
  organizations: [],
  loading: false,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    setActiveOrganization: (state, action: PayloadAction<Organization | null>) => {
      state.activeOrganization = action.payload;
    },
    setOrgLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrganizations, setActiveOrganization, setOrgLoading } =
  organizationSlice.actions;
export default organizationSlice.reducer;
