"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import {
  WifiIcon,
  TvIcon,
  ShirtIcon,
  BatteryFullIcon,
  ArrowUpDownIcon,
  BedDoubleIcon,
  BathIcon,
  ParkingCircleIcon,
  DumbbellIcon,
  ShieldCheckIcon,
  PlugIcon,
  FlameIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const PropertyDetails = () => {
  const { selectedProperty } = useSelector((store) => store.auth);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // ✅ Optional: Map common keywords to icons
  const iconMap = {
    wifi: WifiIcon,
    "free wifi": WifiIcon,
    tv: TvIcon,
    dryer: ShirtIcon,
    "washing machine": ShirtIcon,
    "power backup": BatteryFullIcon,
    backup: BatteryFullIcon,
    elevator: ArrowUpDownIcon,
    ac: FlameIcon,
    air: FlameIcon,
    bed: BedDoubleIcon,
    bath: BathIcon,
    parking: ParkingCircleIcon,
    gym: DumbbellIcon,
    security: ShieldCheckIcon,
    electricity: PlugIcon,
  };

  // ✅ Function to pick an icon for a given amenity
  const getIcon = (name) => {
    if (!name) return null;
    const key = name.toLowerCase();
    const match = Object.keys(iconMap).find((k) => key.includes(k));
    return match ? iconMap[match] : null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Title */}
      <h2 className="text-lg font-semibold">
        Entire place in {selectedProperty?.address?.state},{" "}
        {selectedProperty?.address?.city}
      </h2>
      <p className="text-sm text-gray-600 mb-2">
        {selectedProperty?.address?.detailedAddress}
      </p>

      {/* Ratings */}
    <div className="flex items-center mb-6">
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${
          star <= Math.floor(selectedProperty?.overallratings || 0)
            ? "text-[#eb4c60]"
            : "text-gray-300"
        } fill-current`}
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>

  {/* Numeric Rating + Review Count */}
  <span className="ml-2 text-sm font-medium text-gray-700">
    {selectedProperty?.overallratings
      ? selectedProperty.overallratings.toFixed(1)
      : "0.0"}{" "}
    / 5 · {selectedProperty?.reviews?.length || 0} reviews
  </span>
</div>


      {/* Owner info - visible only on mobile */}
      <div className="lg:hidden mb-6 flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1180&q=80"
            alt="Ashish Kumar"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="font-medium">
            Owned by {selectedProperty?.owner?.fullName}
          </p>
          <p className="text-sm text-gray-500">Verified</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 mb-2">
          {selectedProperty?.description?.slice(0, 150)}
          {!showFullDescription && "..."}
        </p>

        {showFullDescription && (
          <p className="text-gray-700 mb-2">
            {selectedProperty?.description?.slice(150)}
          </p>
        )}

        <Button
          variant="ghost"
          className="text-[#eb4c60] text-sm font-medium px-0 hover:bg-transparent"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </Button>
      </div>

      {/* ✅ Dynamic Amenities */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedProperty?.amenities && selectedProperty.amenities.length > 0 ? (
            selectedProperty.amenities.map((amenity, idx) => {
              const Icon = getIcon(amenity);
              return (
                <div key={idx} className="flex items-center">
                  {Icon ? (
                    <Icon className="w-5 h-5 mr-3" />
                  ) : (
                    <div className="w-5 h-5 mr-3" />
                  )}
                  <span className="text-sm capitalize">{amenity}</span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No amenities listed</p>
          )}
        </div>

        <Button
          variant="ghost"
          className="text-[#eb4c60] text-sm font-medium mt-4 px-0 hover:bg-transparent"
        >
          Show less
        </Button>
      </div>
    </div>
  );
};

export default memo(PropertyDetails);
