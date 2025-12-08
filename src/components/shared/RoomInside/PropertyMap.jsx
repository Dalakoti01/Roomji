"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = await import("leaflet");

      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map
        const map = L.map(mapRef.current, {
          center: [4.1755, 73.5093],
          zoom: 14,
          zoomControl: false,
        });

        // Tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Add a marker for the property
        const marker = L.marker([4.1755, 73.5093]).addTo(map);

        mapInstanceRef.current = map;
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Custom zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="relative h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full z-0" />

      {/* Custom Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          className="bg-white hover:bg-gray-100 p-2 rounded-md shadow-md"
          onClick={handleZoomIn}
        >
          <ZoomIn size={18} />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="bg-white hover:bg-gray-100 p-2 rounded-md shadow-md"
          onClick={handleZoomOut}
        >
          <ZoomOut size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PropertyMap;
