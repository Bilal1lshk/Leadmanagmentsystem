import { createSlice } from "@reduxjs/toolkit";

const LeadSlice=createSlice({
    name:"Lead",
    initialState:{
        Lead: []
    },
    reducers:{
        setAllLeads:(state,action)=>{
        state.Lead=action.payload
    }}
    
})
export  const {setAllLeads}=LeadSlice.actions
export default LeadSlice.reducer
