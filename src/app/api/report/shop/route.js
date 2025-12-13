import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import shopModels from "@/models/shopModels";
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


        const existingShop  = await shopModels.findById(propertyId);
        if (!existingShop) {
            return NextResponse.json({ message: "Shop not found", success: false }, { status: 404 });
        }

        existingShop.reports.push({
            reportedBy: userId,
            reason,
        });
        existingShop.reportStatus = "Pending";
        await existingShop.save();
        
        return NextResponse.json({ message: "Shop reported successfully", success: true }, { status: 200 });
       
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error",success : false }, { status: 500 });
    }
}