"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const PropertyGallery = () => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const { selectedProperty } = useSelector((store) => store.auth);

  // Dynamic images from selectedProperty
  const images =
    selectedProperty?.photos && selectedProperty.photos.length > 0
      ? selectedProperty.photos
      : ["/placeholder1.png", "/placeholder2.png", "/placeholder3.png"]; // fallback

  return (
    <div className="relative w-full">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] rounded-lg overflow-hidden">
        {/* Main Image */}
        <div className="md:col-span-2 h-full relative">
          <Image
            src={images[0]}
            alt="Main property photo"
            fill
            className="object-cover"
          />
        </div>

        {/* Second Image */}
        {images[1] && (
          <div className="hidden md:block h-full relative">
            <Image
              src={images[1]}
              alt="Second property photo"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Third Image + Button */}
        {images[2] && (
          <div className="hidden md:block h-full relative">
            <Image
              src={images[2]}
              alt="Third property photo"
              fill
              className="object-cover"
            />

            {/* Show All Photos Button */}
            <div className="absolute bottom-4 right-4 z-20">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-2 shadow-md cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              >
                <ImageIcon size={16} />
                Show all photos
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View Button */}
      <Button
        variant="secondary"
        size="sm"
        className="md:hidden absolute bottom-4 right-4 z-20 bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-2 shadow-md cursor-pointer"
        onClick={() => setShowAllPhotos(true)}
      >
        <ImageIcon size={16} />
        Show all photos
      </Button>

      {/* Custom Fullscreen Gallery */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto w-screen h-screen">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-white border-b p-4 flex justify-between items-center shadow-sm">
            <h2 className="text-lg font-semibold">
              Property Photos ({images.length})
            </h2>
            <Button
              variant="ghost"
              className="text-[#eb4c60] cursor-pointer flex items-center gap-1"
              onClick={() => setShowAllPhotos(false)}
            >
              <XIcon size={18} />
              Close
            </Button>
          </div>

          {/* Image Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div key={index} className="h-[300px] sm:h-[400px] relative">
                <Image
                  src={img}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
