import { NextResponse } from "next/dist/api/server.js";
import usermodel from "../../../models/user.js"

export async function GET() {
    const allusers = await usermodel.find()
    if (!allusers) return
    console.log(allusers)
    return NextResponse.json({
        allusers,
        message: "All users avaliable",
        succes: true
    })

}