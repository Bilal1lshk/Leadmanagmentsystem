import FollowUp from "@/app/models/followup";
import Lead from "@/app/models/lead";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 });
    
    await connectDB();

    // Ensure models are registered in Mongoose schema cache before populating
    const _l = Lead;
    const _u = User;

    let Allfollowup = await FollowUp.find({ organization: membership.organization })
      .populate("lead")
      .populate("assignedTo")
      .populate("CreatedBy");

    // Auto-seed real demo follow-ups if organization has no follow-ups yet
    if (Allfollowup.length === 0) {
      let leads = await Lead.find({ organization: membership.organization }).limit(3);
      
      // If no leads exist for this workspace, create sample leads first
      if (leads.length === 0) {
        const demoLeads = await Lead.insertMany([
          {
            organization: membership.organization,
            personId: "LEAD-101 (Acme Corp)",
            sourcedby: user._id,
            source: "referral",
            message: "Interested in enterprise CRM migration.",
            phone: "+1 555-0192",
            email: "contact@acme.com",
            status: "contacted",
            priority: "high",
            estimatedValue: 15000,
            assignedTo: user._id
          },
          {
            organization: membership.organization,
            personId: "LEAD-102 (GlobalTech)",
            sourcedby: user._id,
            source: "website",
            message: "Requested demo for sales team.",
            phone: "+1 555-0144",
            email: "info@globaltech.io",
            status: "qualified",
            priority: "medium",
            estimatedValue: 8500,
            assignedTo: user._id
          },
          {
            organization: membership.organization,
            personId: "LEAD-103 (Nexus Logistics)",
            sourcedby: user._id,
            source: "ad",
            message: "Follow up regarding proposal terms.",
            phone: "+1 555-0188",
            email: "deals@nexus.com",
            status: "proposal",
            priority: "high",
            estimatedValue: 22000,
            assignedTo: user._id
          }
        ]);
        leads = demoLeads;
      }

      const now = Date.now();
      const demoFollowups = [
        {
          organization: membership.organization,
          lead: leads[0]._id,
          comments: "Schedule product walkthrough with decision maker.",
          duedate: new Date(now + 86400000 * 2), // 2 days later
          CreatedBy: user._id,
          assignedTo: user._id,
          status: "pending"
        },
        {
          organization: membership.organization,
          lead: leads[1]._id,
          comments: "Send updated pricing matrix and SLA details.",
          duedate: new Date(now - 86400000 * 1), // Overdue by 1 day
          CreatedBy: user._id,
          assignedTo: user._id,
          status: "pending"
        },
        {
          organization: membership.organization,
          lead: leads[2]?._id || leads[0]._id,
          comments: "Initial discovery call completed successfully.",
          duedate: new Date(now - 86400000 * 3),
          CreatedBy: user._id,
          assignedTo: user._id,
          status: "completed"
        }
      ];

      await FollowUp.insertMany(demoFollowups);

      Allfollowup = await FollowUp.find({ organization: membership.organization })
        .populate("lead")
        .populate("assignedTo")
        .populate("CreatedBy");
    }

    return NextResponse.json( 
      { message: "Follow-ups", data: Allfollowup, success: true },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Fetch followups error:", err);
    return NextResponse.json(
      { message: "Failed to find followups" },
      { status: 500 }
    );
  }
}
