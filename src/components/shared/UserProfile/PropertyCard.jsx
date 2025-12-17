"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // ✅ import from react-hot-toast

export default function PropertyCard({
  image,
  price,
  title,
  location,
  description,
  propertyId,
  type, // determines API endpoint
  showToggle = true,
  userName ,
  initialVisibility = true, // from backend
}) {
  const [isVisible, setIsVisible] = useState(initialVisibility);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = (checked) => {
    if (!checked) {
      setOpenDialog(true);
    } else {
      toggleVisibility(true);
    }
  };

  const toggleVisibility = async (makePublic) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/removePublic/${type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      const data = await res.json();

      if (data.success) {
        setIsVisible(data.property?.isPublic ?? makePublic);
        toast.success(data.message || "Property visibility updated successfully!");
      } else {
        toast.error(data.message || "Failed to update property visibility!");
      }
    } catch (err) {
      console.error("Error updating property:", err);
      toast.error("Something went wrong while updating visibility!");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const confirmRemoval = () => toggleVisibility(false);

  const cancelRemoval = () => {
    setIsVisible(true);
    setOpenDialog(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image + Price */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-md shadow-sm">
          <p className="text-sm font-medium">{price} / mon</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{location}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
      </div>

      {/* Footer Section */}
      {showToggle && (
        <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
          {/* User Info */}
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
              <Image
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                alt="User"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm">{userName}</span>
            <div className="ml-1">
              <span className="inline-flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
                <Star size={10} color="white" fill="white" />
              </span>
            </div>
          </div>

          {/* Toggle Info */}
          <div className="flex items-center space-x-2">
            <span className="text-xs">{isVisible ? "Public" : "Hidden"}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  If you turn off this toggle, the property will go offline and
                  will no longer be visible to anyone.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={isVisible}
              onCheckedChange={handleToggle}
              disabled={loading}
              className="cursor-pointer" // ✅ added
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Property from Public View</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to remove this property from public view? It
              will no longer be visible to other users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={cancelRemoval}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRemoval}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              {loading ? "Removing..." : "Yes, Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
