import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";
import shopModels from "@/models/shopModels";

export async function GET(req,{params}) {
  try {
    await connectDB();
    const { id } =  await params;
    if(!id){
        return NextResponse.json({message: "Room ID is required", success: false}, {status: 400});
    }

    const shop  = await shopModels.findById(id).populate('ownerId');
    if(!shop){
        return NextResponse.json({message: "No Shop found", success: false}, {status: 404});
    }

    return NextResponse.json({message: "Shop fetched successfully", success: true, shop}, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
