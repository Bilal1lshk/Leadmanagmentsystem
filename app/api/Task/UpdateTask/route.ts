import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection"
import Task from "@/app/models/task";

export async function PUT(
    request: NextRequest,
) {
    try {
        await connectDB();

        const body = await request.json();
        const { completed, taskId } = body;
        // Validate status
        const allowedStatuses = ["pending", "in-progress", "completed"];

        if (!completed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Status is required",
                },
                { status: 400 }
            );
        }

        if (!allowedStatuses.includes(completed)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid status",
                },
                { status: 400 }
            );
        }

        // Find and update single task
        const task = await Task.findByIdAndUpdate(
            taskId,
            { completed },
            { new: true, runValidators: true }
        );

        // Task doesn't exist
        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Task status updated successfully",
                data: task,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update task status error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update task status",
            },
            { status: 500 }
        );
    }
}