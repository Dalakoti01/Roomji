import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";

export async function GET(req,{params}) {
  try {
    await connectDB();
    const { id } =  await params;
    if(!id){
        return NextResponse.json({message: "ID is required", success: false}, {status: 400});
    }

    const sellingProperty  = await sellingPropertiesModels.findById(id).populate('ownerId');
    if(!sellingProperty){
        return NextResponse.json({message: "Selling Property not found", success: false}, {status: 404});
    }

    return NextResponse.json({message: "Selling Property fetched successfully", success: true, sellingProperty}, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
