import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import serviceModels from "@/models/serviceModels";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        await connectDB();
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({message : "Token Not Found",success : false},{status : 404});   
        }

        const existingAdmin = await userModels.findById(userId).select("-password -otp");
        if(!existingAdmin || existingAdmin.role !== "admin"){
            return NextResponse.json({message : "Admin Not Found. Unauthorized",success : false},{status : 401});   
        }

        const rentedProperties = await rentedPropertiesModels.find();
        const sellingProperties = await sellingPropertiesModels.find();
        const services = await serviceModels.find();
        const shops = await shopModels.find();

        return NextResponse.json({
            message : "Properties fetched successfully",
            success : true,
            rentedProperties : rentedProperties || [],
            sellingProperties : sellingProperties || [],
            services : services || [],
            shops : shops || []
        },{status : 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Internal Server Error",success : false},{status : 500});   
    }
}