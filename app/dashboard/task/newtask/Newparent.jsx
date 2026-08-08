import CreateTaskForm from './page.tsx'
import { useAppSelector } from "@/app/redux/hooks";

export default function NewParent() {
    const reduxLeads = useAppSelector((store) => store?.LeadSlice?.Lead);
    console.log("reduxLeads:", reduxLeads);
    return (
        <div>
            <CreateTaskForm />
        </div>
    )
}