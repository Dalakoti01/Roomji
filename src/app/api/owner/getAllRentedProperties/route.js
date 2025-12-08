import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        await connectDB();
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({message:"Token not found",success:false},{status:401});
        }

        const existingUser = await userModels.findById(userId).select("-password -otp");

        if(!existingUser){
            return NextResponse.json({message:"No such user found",success:false},{status:404});
        }   

        const ownerRentedProperties = await rentedPropertiesModels.find({ownerId:userId});
        if(!ownerRentedProperties || ownerRentedProperties.length === 0){
            return NextResponse.json({message:"No rented properties found for this owner",success:false},{status:404});
        }

        return NextResponse.json({message:"Rented properties fetched successfully",success:true,ownerRentedProperties},{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"Internal Server Error",success:false},{status:500})
    }
}