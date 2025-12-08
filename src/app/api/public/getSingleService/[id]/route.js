import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";
import serviceModels from "@/models/serviceModels";

export async function GET(req,{params}) {
  try {
    await connectDB();
    const { id } =  await params;
    if(!id){
        return NextResponse.json({message: "Room ID is required", success: false}, {status: 400});
    }

    const service  = await serviceModels.findById(id).populate('ownerId');
    if(!service){
        return NextResponse.json({message: "No Service found", success: false}, {status: 404});
    }

    return NextResponse.json({message: "Service  fetched successfully", success: true, service}, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
