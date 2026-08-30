import { NextRequest, NextResponse } from "next/server";
import taskmodel from '@/app/models/task'
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id");
        const deleted = await taskmodel.findByIdAndDelete({ _id: id })
        if (!deleted) return NextResponse.json({ message: "No task found with this id" }, { status: 404 })
        return NextResponse.json(
            { success: true, message: "Task deleted successfully" },
            { status: 200 }
        );
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error in Deleting task" }, { status: 500 })
    }
}