import { NextResponse } from "next/server";
import dbConnect from "../../../config/mongodbconnection"
import taskmodel from "../../../models/task"
export async function GET() {
    try{
 await dbConnect()
    const alltasks= await taskmodel.find()
    if(!alltasks) return NextResponse.json({message:"No tasks found"}, {status:404})
    return NextResponse.json({
        alltasks,
        message:"All tasks fetched successfully",
        succes:true
    })
    }catch(err){
        return NextResponse.json({message:"Error in fetching tasks"}, {status:500})
    }
   
}