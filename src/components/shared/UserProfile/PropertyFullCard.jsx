"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Ruler, Wifi, Car, Trees, Square } from "lucide-react";

const PropertyFullCard = () => {
  const [isLive, setIsLive] = useState(true);

  return (
    <Card
      className={`flex flex-col md:flex-row w-full rounded-2xl shadow-md border overflow-hidden transition-all ${
        isLive ? "" : "border-gray-300"
      }`}
    >
      {/* Image Section */}
      <div className="relative w-full md:w-1/3 md:min-h-full h-44 md:h-auto overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-t-none flex-shrink-0">
        <Image
          src="https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg"
          alt="Property"
          fill
          className="object-cover"
        />

        {/* Live / Not Live Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-md text-sm font-medium ${
            isLive ? "" : "bg-gray-200 text-gray-600"
          }`}
        >
          {isLive ? "Live" : "Not Live"}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-md font-semibold shadow-sm">
          $25,000 / mon
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="flex flex-col justify-between p-4 w-full md:w-2/3">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              Modern Apartment Include Garden
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Alpha 2, Greater Noida, India
            </p>
            <p
              className={`mt-1 text-sm font-medium flex items-center gap-1 ${
                isLive ? "text-green-600" : "text-gray-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              Property is {isLive ? "live" : "not live"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Switch checked={isLive} onCheckedChange={setIsLive} />
          </div>
        </div>

        {/* Property Info */}
        <div className="flex flex-wrap gap-3 text-sm mt-3 text-gray-700">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> 3 Beds
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> 2 Baths
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4" /> 1250 sq.ft
          </div>
        </div>

        {/* About Section */}
        <div className="mt-3 text-sm text-gray-600 leading-relaxed">
          <h4 className="font-medium text-gray-800">About this property</h4>
          <p>
            Luxury apartment with stunning views and modern amenities.
            Spacious modern apartment with an open floor plan, high ceilings,
            and plenty of natural light. Recently renovated with premium
            finishes throughout.
          </p>
        </div>

        {/* Amenities */}
        <div className="mt-3">
          <h4 className="font-medium text-gray-800 mb-1">Amenities</h4>
          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" /> Parking
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4" /> Wi-Fi
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" /> Balcony
            </div>
            <div className="flex items-center gap-1">
              <Trees className="w-4 h-4" /> Garden
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/user-placeholder.jpg"
              alt="User"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-800">Ashish Kumar</p>
            </div>
          </div>
          <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 cursor-pointer">
            See Full Property
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFullCard;
