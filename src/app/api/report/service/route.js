import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import serviceModels from "@/models/serviceModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function  POST(req) {
    try {
        await connectDB();
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const existingUser = await userModels.findById(userId).select("-password -otp");
        if (!existingUser) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        const { propertyId, reason } = await req.json();

         if (!propertyId || !reason) {
            return NextResponse.json({ message: "Property ID and reason are required", success: false }, { status: 400 });
        }


        const existingService  = await serviceModels.findById(propertyId);
        if (!existingService) {
            return NextResponse.json({ message: "Service not found", success: false }, { status: 404 });
        }

        existingService.reports.push({
            reportedBy: userId,
            reason,
        });

        await existingService.save();

        return NextResponse.json({ message: "Property reported successfully", success: true }, { status: 200 });
       
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error",success : false }, { status: 500 });
    }
}