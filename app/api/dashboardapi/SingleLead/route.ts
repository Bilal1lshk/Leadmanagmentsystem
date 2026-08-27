import leadmodel from "@/app/models/lead";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return Response.json({ success: false, message: "Missing lead id." }, { status: 400 });
        }

        const findedlead = await leadmodel.findById(id)
        if (!findedlead) return NextResponse.json({succes:false,message:"NO lead like this avalible"})
        return Response.json({ success: true, data: {findedlead} }, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ success: false, message: "Internal server error." }, { status: 500 });
    }
}