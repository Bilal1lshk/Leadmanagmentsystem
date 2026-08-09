import { NextResponse } from "next/server";
import leadmodel from "../../../../models/lead.js";
export async function POST(Request) {
  console.log("request hitted");
  try {
    const {
      sourcedby,
      status,
      personId,
      priority,
      estimatedValue,
      assignedTo,
      lastContactedAt,
    } = await Request.json();
    if (!personId || 
      !sourcedby ||
      !status ||
      !priority ||
      !estimatedValue ||
      !lastContactedAt) {
      return NextResponse.json(
        { message: "all fields should be filled" },
        { status: 400 }
      );
    }

    if (status === "lost" && !lostReason) {
      return NextResponse.json(
        { message: "all fields should be filled" },
        { status: 400 }
      );
    }

    const created = await leadmodel.create({
      personId,
      sourcedby,
      status,
      priority,
      estimatedValue,
      assignedTo,
      lastContactedAt,
    })

    if(!created) return NextResponse.json({message:"Something went wrong in lead creation try again "})
    console.log(created);
    return NextResponse.json({ message: "lead created succesfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
