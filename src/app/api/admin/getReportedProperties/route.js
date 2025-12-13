import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import serviceModels from "@/models/serviceModels";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 404 }
      );
    }

    const existingAdmin = await userModels.findById(userId).select("-password -otp");
    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        { message: "Admin Not Found. Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Only fetch documents that have a non-empty `reports` array
    // Using the "reports.0 exists" pattern is efficient and works across mongoose/mongo versions
    const rentedProperties = await rentedPropertiesModels.find({ "reports.0": { $exists: true } });
    const sellingProperties = await sellingPropertiesModels.find({ "reports.0": { $exists: true } });
    const services = await serviceModels.find({ "reports.0": { $exists: true } });
    const shops = await shopModels.find({ "reports.0": { $exists: true } });

    // If you want to populate the reportedBy user info (recommended), uncomment and adjust:
    // e.g.
    // const rentedProperties = await rentedPropertiesModels.find({ "reports.0": { $exists: true } }).populate("reports.reportedBy", "fullName email");
    // Repeat populate for other queries as needed.

    return NextResponse.json(
      {
        message: "Reported items fetched successfully",
        success: true,
        rentedProperties: rentedProperties || [],
        sellingProperties: sellingProperties || [],
        services: services || [],
        shops: shops || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}
