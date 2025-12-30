"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import LocationTabs from "../LocationTabs";
import ImageUpload from "../ImageUpload";
import ProviderDetails from "../ProviderDetails";
import { useDispatch, useSelector } from "react-redux";
import ApartmentForm from "./ApartmentForm";
import { useRouter } from "next/navigation";
import { setSavedProperty } from "@/redux/authSlice";

export default function HeroSellApartmentListing() {
  const { user } = useSelector((store) => store.auth);
  const router = useRouter();
  const dispatch = useDispatch()
  // ✅ Collect data from child components
  const [locationData, setLocationData] = useState({});
  const [formData, setFormData] = useState({});
const [providerDetails, setProviderDetails] = useState({
  fullName: user?.fullName || "",
  email: user?.email || "",
  phoneNumber: user?.phoneNumber || "",
  showPhoneNumber: user?.showPhoneNumber || false,
  profession: "",
  personalNote: "",
});  const [images, setImages] = useState([]);

  const handleSaveListing = () => {
  // optional basic validation
  if (!formData.title || !locationData.city || !locationData.state) {
    toast.error("Please fill title and location before saving");
    return;
  }

  dispatch(
    setSavedProperty({
      title: formData.title || "",
      description: formData.description || "",
      price: formData.price || "",
      city: locationData.city || "",
      state: locationData.state || "",
      detailedAddress: locationData.address || "",
    })
  );

  toast.success("Listing saved locally");
};


  // ✅ Handle form submission
  const handlePublish = async () => {
    try {
      const data = new FormData();

      // --- (build your form data as before) ---
      data.append("title", formData.title || "");
      data.append("description", formData.description || "");
      data.append("price", formData.price || "");
      data.append("area", formData.area || "");
      data.append("securityDeposit", formData.securityDeposit || "");
      data.append("category", formData.category || "");

      if (formData.policies && formData.policies.length > 0) {
        data.append("policies", formData.policies.join(","));
      }

      data.append("uniqueCode", user?.uniqueId || "TEMP123");
      data.append("city", locationData.city || "");
      data.append("state", locationData.state || "");
      data.append("detailedAddress", locationData.address || "");
      data.append("googleLat", locationData.lat || "");
      data.append("googleLng", locationData.lng || "");
      data.append("googlePlaceId", locationData.placeId || "");

      if (formData.amenities && formData.amenities.length > 0) {
        data.append("amenities", formData.amenities.join(","));
      }

      data.append("fullName", providerDetails.fullName || "");
      data.append("email", providerDetails.email || "");
      data.append("phoneNumber", providerDetails.phoneNumber || "");
      data.append(
        "showPhoneNumber",
        providerDetails.showPhoneNumber ? "true" : "false"
      );
      data.append("profession", providerDetails.profession || "");
      data.append("personalNote", providerDetails.personalNote || "");

      images.forEach((file) => data.append("photos", file));

      toast.loading("Publishing your listing...");

      // IMPORTANT: do NOT set Content-Type manually for FormData
      const res = await axios.post("/api/create/sellProperties", data, {
        // Allow handling of 4xx in resolved flow (so axios doesn't throw on 403)
        validateStatus: (status) => status < 500,
        // headers: { /* DO NOT set Content-Type here */ },
      });

      toast.dismiss();
      console.log("Publish response status:", res.status, "data:", res.data);

      if (res.status === 201 && res.data?.success) {
        dispatch(setSavedProperty(null)); // Clear saved property on success
        toast.success("Property listed successfully!");
        router.push("/user/profile");
        return;
      }

      // Specific free trial exhausted handling
      if (res.status === 403 && res.data?.code === "FREE_TRIAL_EXHAUSTED") {
        console.log("Free trial exhausted detected (resolved path)");
        toast.error(
          "You have exhausted your free trial. Buy a subscription to keep posting properties."
        );
        router.push("/user/pricing");
        return;
      }

      // Other non-2xx handled responses
      toast.error(res.data?.message || "Failed to publish listing");
    } catch (error) {
      // Axios threw — maybe network error or server closed stream
      toast.dismiss();
      console.error("Publish error (catch):", error);

      // If server responded but axios rejected, check response inside error
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 403 && data?.code === "FREE_TRIAL_EXHAUSTED") {
        console.log("Free trial exhausted detected (catch path)");
        toast.error(
          "You have exhausted your free trial. Buy a subscription to keep posting properties."
        );
        router.push("/user/pricing");
        return;
      }

      // Optional: show server message if available
      if (data?.message) {
        toast.error(data.message);
        return;
      }

      toast.error("Something went wrong while publishing");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Sell Property Listing
        </h1>

        <Button onClick={handleSaveListing} className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white flex items-center gap-2 cursor-pointer">
          <PlusSquare className="h-5 w-5" />
          Save Listing
        </Button>
      </div>

      {/* Location Tabs */}
      <LocationTabs onChange={(data) => setLocationData(data)} />

      {/* Image Upload */}
      <div className="mt-8">
        <ImageUpload onChange={(files) => setImages(files)} />
      </div>

      {/* Form & Provider Details */}
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-2/3">
          <ApartmentForm onChange={(data) => setFormData(data)} />
        </div>
        <div className="w-full md:w-1/3">
          <ProviderDetails
            photo={user?.profilePhoto}
            fullName={user?.fullName}
            email={user?.email}
            phoneNumber={user?.phoneNumber}
            showPhoneNumber={user?.showPhoneNumber} // 👈 add this
            uniqueId={user?.uniqueId || "#USR121"}
            onChange={(data) => setProviderDetails(data)}
          />
        </div>
      </div>

      {/* Publish Button */}
      <div className="mt-8 flex justify-center md:justify-end">
        <Button
          size="lg"
          onClick={handlePublish}
          className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white font-medium text-lg px-8 py-3 cursor-pointer"
        >
          Publish Listing
        </Button>
      </div>
    </div>
  );
}
