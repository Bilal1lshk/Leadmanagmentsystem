import { NextResponse } from "next/server";
import leadmodel from "../../../../models/lead.js"
export async function POST(Request) {
    console.log("request hitted")
    try {
        const {
            source,
            status,
            personId,
            priority,
            estimatedValue,
            assignedTo,
            lastContactedAt,
            lostReason, } = await Request.json();

        const created = await leadmodel.create({
            source, status, personId, source, status, priority,
            estimatedValue,
            assignedTo,
            lastContactedAt,
            lostReason,
        })
        console.log(created)
        return NextResponse.json({ message: "done done" });
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}