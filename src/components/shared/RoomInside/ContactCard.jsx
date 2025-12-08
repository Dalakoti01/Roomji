"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Phone, Mail, Flag, Notebook, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setChattingUser } from "@/redux/messageSlice";

const ContactCard = ({ category }) => {
  const { selectedProperty } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const dispatch = useDispatch()

  const reportOptions = [
    "I just don't like it",
    "Bullying or unwanted contact",
    "Suicide, self-injury or eating disorders",
    "Violence, hate or exploitation",
    "Selling or promoting restricted items",
    "Nudity or sexual activity",
    "Scam, fraud or spam",
    "False information",
  ];

  const handleReport = async (reason) => {
    try {
      setLoading(true);

      // ✅ Construct endpoint dynamically based on category
      const propertyId = selectedProperty?._id;
      if (!propertyId) {
        toast.error("Invalid property ID");
        return;
      }

      const endpoint = `/api/report/${category}/${propertyId}`;

      const res = await axios.post(endpoint, { reason });

      if (res.data.success) {
        toast.success(res.data.message || "Reported successfully");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="bg-[#f8f6f5] p-6 rounded-lg shadow-sm w-full max-w-sm mx-auto">
      {/* Owner info */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
          <Image
            src={
              selectedProperty?.ownerId?.profilePhoto ||
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1180&q=80"
            }
            alt="Owner photo"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="font-bold text-lg flex items-center">
          {selectedProperty?.owner?.fullName || "Unknown Owner"}
          <span className="ml-1 text-[#eb4c60]">★</span>
        </h3>
        <p className="text-sm text-gray-500">
          {selectedProperty?.owner?.uniqueId || "No ID"}
        </p>
      </div>

      {/* Contact info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span>{selectedProperty?.owner?.email || "Not available"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{selectedProperty?.owner?.phoneNumber || "Not available"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>{selectedProperty?.owner?.profession || "Not specified"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Notebook className="w-4 h-4 mr-2" />
          <span>{selectedProperty?.owner?.personalNote || "No personal note"}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Button onClick={() => router.push(`/ownersProfile/${selectedProperty?.ownerId?._id}`)} className="w-full bg-[#eb4c60] hover:bg-[#d43b4f] text-white cursor-pointer">
          Full Profile
        </Button>
       <Button
  onClick={() => {
    const owner = selectedProperty?.ownerId; // adjust if your owner data is nested
    if (owner) {
      dispatch(setChattingUser(owner));
    }
    router.push(`/user/message`);
  }}
  variant="outline"
  className="w-full border-[#eb4c60] text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white cursor-pointer"
>
  Contact
</Button>

      </div>

      {/* Report Listing Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center text-gray-500 text-sm mt-4 hover:text-[#eb4c60] transition cursor-pointer">
            <Flag size={14} className="mr-2" />
            Report this listing
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center mb-3">
              Why are you reporting this post?
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-2">
            {reportOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleReport(option)}
                disabled={loading}
                className="flex items-center justify-between text-left text-sm py-3 px-3 border-b border-gray-200 hover:bg-gray-100 rounded-md transition cursor-pointer"
              >
                <span>{option}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactCard;
