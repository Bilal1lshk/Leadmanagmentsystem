import { NextResponse } from "next/server";
import leadmodel from "../../../../models/lead.js";
export async function POST(Request) {
  console.log("request hitted");
  try {
    const {
      sourcedby,
      source,
      status,
      personId,
      priority,
      estimatedValue,
      assignedTo,
      lastContactedAt,
      lostReason,
    } = await Request.json();
    if (!sourcedby || !source || !status || !personId || !priority) {
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
      sourcedby,
      source,
      status,
      priority,
      estimatedValue,
      lostReason,
    })

    if(!created) return NextResponse.json({message:"Something went wrong in lead creation try again "})
    console.log(created);
    return NextResponse.json({ message: "lead created succesfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
