import lead from "@/app/models/lead";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    console.log("hitted")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({
        message: "Something went wrong try again later",
                succes:false

    })
    const deleted=await lead.findOneAndDelete({_id:id})
    if(!deleted) return NextResponse.json({
        message:"Something went wrong try again later",
                succes:false


    })
    NextResponse.json({
        message:"deleted succesfully",
        succes:true
    })
}