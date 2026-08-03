import { LeadSlice } from "./leads.js"
import { configureStore } from "react-redux"
const store = configureStore({
    reducer: {
        LeadSlice
    }
})
export default store