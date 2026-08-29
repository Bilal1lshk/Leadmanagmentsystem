import { NextResponse } from "next/server";
import dbConnect from "../../../config/mongodbconnection"
import taskmodel from "../../../models/task"
import Lead from "@/app/models/lead";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";
export async function POST(Request:Request) {
    try {   
        const user = await getCurrentUser(Request)
        if (!user) return unauthorizedResponse()
        const membership = await getCurrentOrganization(Request, user)
        if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 })
        await dbConnect()
        const { assignedTo, dueDate, leadId, title } = await Request.json()
        if (!assignedTo || !dueDate || !leadId || !title) return NextResponse.json({ message: "All fields should be filled" }, { status: 400 })
        const lead = await Lead.findOne({ _id: leadId, organization: membership.organization })
        if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 })
        const task = await taskmodel.create({
            organization: membership.organization,
            assignedTo,
            dueDate,
            leadId,
            title
        })
        if (!task) return NextResponse.json({ message: "Something went wrong in task creation try again" }, { status: 500 })
        return NextResponse.json({ data: task, success: true }, { status: 201 })

    }
    catch (err) {
        return NextResponse.json({ message: "Error in creating task" }, { status: 500 })
    }
}
