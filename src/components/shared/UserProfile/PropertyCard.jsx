"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Info, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

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
import { useDispatch } from "react-redux";
import { setOwnerAllServices, setOwnerAllShops, setOwnerRentedProperties, setOwnerSellingProperties } from "@/redux/authSlice";

export default function PropertyCard({
  image,
  price,
  title,
  location,
  description,
  propertyId,
  type, // rentedProperties | sellingProperties | shop | service
  showToggle = true,
  userName,
  initialVisibility = true,
}) {
  const router = useRouter();
  const dispatch = useDispatch()
  

  const [isVisible, setIsVisible] = useState(initialVisibility);
  const [openVisibilityDialog, setOpenVisibilityDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------------- CARD NAVIGATION ---------------- */

  const handleCardClick = () => {
    // ⛔ block navigation if menu or dialog is open
    if (menuOpen || openDeleteDialog || openVisibilityDialog) return;

    if (!propertyId) return;

    switch (type) {
      case "rentedProperties":
        router.push(`/rentProperty/${propertyId}`);
        break;
      case "shop":
        router.push(`/rentShop/${propertyId}`);
        break;
      case "service":
        router.push(`/service/${propertyId}`);
        break;
      case "sellingProperties":
        router.push(`/sellProperty/${propertyId}`);
        break;
      default:
        console.warn("Unknown property type:", type);
    }
  };

  /* ---------------- VISIBILITY TOGGLE ---------------- */

  const handleToggle = (checked) => {
    if (!checked) {
      setOpenVisibilityDialog(true);
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
        toast.success(data.message || "Visibility updated");
      } else {
        toast.error(data.message || "Failed to update visibility");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpenVisibilityDialog(false);
    }
  };

  /* ---------------- DELETE PROPERTY ---------------- */

  const handleDelete = async () => {
  try {
    setLoading(true);

    const res = await axios.delete("/api/delete/property", {
      data: {
        propertyId,
        propertyType: type,
      },
    });

    if (res.data.success) {
      toast.success(res.data.message);

      const { deletedType, updatedData } = res.data;

      switch (deletedType) {
        case "rentedProperties":
          dispatch(setOwnerRentedProperties(updatedData));
          break;

        case "sellingProperties":
          dispatch(setOwnerSellingProperties(updatedData));
          break;

        case "shop":
          dispatch(setOwnerAllShops(updatedData));
          break;

        case "service":
          dispatch(setOwnerAllServices(updatedData));
          break;

        default:
          console.warn("Unknown deleted type");
      }

      setOpenDeleteDialog(false);
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete property");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
    >
      {/* ---------- 3 DOT MENU ---------- */}
      <div
        className="absolute top-2 right-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded-full bg-white shadow hover:bg-gray-100 cursor-pointer"
        >
          <EllipsisVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md">
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push(`/edit/${type}/${propertyId}`);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              <Pencil size={14} /> Edit
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                setOpenDeleteDialog(true);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* ---------- IMAGE ---------- */}
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

      {/* ---------- DETAILS ---------- */}
      <div className="p-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{location}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
      </div>

      {/* ---------- FOOTER ---------- */}
      {showToggle && (
        <div
          className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center">
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
              alt="User"
              width={24}
              height={24}
              className="rounded-full mr-2"
            />
            <span className="text-sm">{userName}</span>
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
              <Star size={10} color="white" fill="white" />
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs">{isVisible ? "Public" : "Hidden"}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Turning this off hides the listing from public view.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={isVisible}
              onCheckedChange={handleToggle}
              disabled={loading}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ---------- DELETE CONFIRMATION ---------- */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              This action is irreversible. Are you sure you want to delete this
              listing?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
