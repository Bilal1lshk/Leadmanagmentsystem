import { NextResponse } from "next/dist/api/server.js";
import usermodel from "../../../models/user.js"

export async function GET() {
    console.log("Fetching all users");
    const allusers = await usermodel.find()
    if (!allusers) return
    return NextResponse.json({
        allusers,
        message: "All users avaliable",
        succes: true
    })

}