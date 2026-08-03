import { createSlice } from "@reduxjs/toolkit";

const LeadSlice=createSlice({
    name:"Lead",
    initialState:{
        AllLeads:null
    },
    reducers:{
        setAllLeads:(state,action)=>{
        state.Lead=action.payload
    }}
    
})
export  const {setAllLeads}=LeadSlice.actions
export default LeadSlice.reducer
