import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function  POST(req,{ params }) {
    try {
        await connectDB();
        const {id} = await params;
        if(!id){
            return NextResponse.json({ message: "Property ID is required", success: false }, { status: 400 });
        }
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const existingUser = await userModels.findById(userId).select("-password -otp");
        if (!existingUser) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        const {  reason } = await req.json();

         if ( !reason) {
            return NextResponse.json({ message: "reason is required", success: false }, { status: 400 });
        }


        const existingProperty  = await rentedPropertiesModels.findById(id);
        if (!existingProperty) {
            return NextResponse.json({ message: "Property not found", success: false }, { status: 404 });
        }

        existingProperty.reports.push({
            reportedBy: userId,
            reason,
        });
        existingProperty.reportStatus = "Pending";

        await existingProperty.save();

        return NextResponse.json({ message: "Property reported successfully", success: true }, { status: 200 });
       
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error",success : false }, { status: 500 });
    }
}