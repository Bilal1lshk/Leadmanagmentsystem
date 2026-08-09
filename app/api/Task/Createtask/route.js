import { NextResponse } from "next/server";
import dbConnect from "../../../config/mongodbconnection"
import taskmodel from "../../../models/task"
export async function POST(Request) {
    try {
        await dbConnect()
        console.log("request hitted")
        const {assignedTo, dueDate, leadId, title } = await Request.json()
        if (!assignedTo || !dueDate || !leadId || !title) return NextResponse.json({ message: "All fields should be filled" }, { status: 400 })
        const task = await taskmodel.create({
            assignedTo,
            dueDate,
            leadId,
            title
        })
        console.log(task)
        if(!task) return NextResponse.json({ message: "Something went wrong in task creation try again" }, { status: 500 })
        return NextResponse.json(task, { status: 201 })

    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error in creating task" }, { status: 500 })
    }
}