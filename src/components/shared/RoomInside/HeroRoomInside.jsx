"use client";

import React from "react";

import { Flag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyGallery from "./PropertyGallery";
import PropertyDetails from "./PropertyDetails";
import RoomPolicies from "./RoomPolicies";
import ContactCard from "./ContactCard";
import PropertyMap from "./PropertyMap";
import ReviewsSection from "./ReviewSection";
import { useParams } from "next/navigation";
import useGetSingleRentedRoom from "@/hooks/public/useGetSingleRentedRoom";
import { useSelector } from "react-redux";

const HeroRoomInside = () => {
  const {id} = useParams()
  useGetSingleRentedRoom(id)
  const {selectedProperty} = useSelector((store) => store.auth)
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Property Title and ID */}
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">{selectedProperty?.address?.detailedAddress}</h1>
        <span className="text-gray-500 text-sm">#{selectedProperty?.uniqueCode}</span>
      </div>

      {/* Property Gallery */}
      <PropertyGallery />

      {/* Property Details and Contact Card */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Details Section */}
          <PropertyDetails />

          {/* Contact Owner Button (Mobile Only) */}
          <div className="lg:hidden mt-6 mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare size={18} />
              <span>Contact the owner of the property</span>
            </Button>
          </div>

          {/* Room Policies */}
          <RoomPolicies />

          {/* Report Listing (Mobile Only) */}
          <div className="lg:hidden mt-6 mb-6">
            <Button
              variant="ghost"
              className="flex items-center text-gray-500 text-sm px-0 hover:text-[#eb4c60]"
            >
              <Flag size={14} className="mr-2" />
              Report this listing
            </Button>
          </div>
        </div>

        {/* Contact Card (Desktop) */}
        <div className="hidden lg:block">
          <ContactCard category="rentedProperty"  />
        </div>
      </div>

      {/* Map Section */}
      {/* <div className="my-8">
        <h2 className="text-xl font-bold mb-4">Where you'll be</h2>
        <p className="text-sm text-gray-500 mb-2">
          Dhonakulhi Island, Uttar Pradesh, India
        </p>
        <PropertyMap />
      </div> */}

      {/* Reviews Section */}
      <ReviewsSection />
    </div>
  );
};

export default HeroRoomInside;
