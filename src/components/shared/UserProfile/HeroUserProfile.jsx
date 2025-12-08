"use client";

import React from "react";
import { ChevronRight, Plus } from "lucide-react";
import ProfileSection from "./ProfileSection";
import PropertyCard from "./PropertyCard";
import AddListingSection from "./AddListingSection";
import ReviewSection from "./ReviewSection";
import Image from "next/image";
import { Award, Settings, ShieldCheck, Star, Check } from "lucide-react";
import EditProfileDialog from "./EditProfileDialog";
import { useSelector } from "react-redux";
import useGetOwnerRentedProperties from "@/hooks/useGetOwnerRentedProperties";
import useGetOwnerSellingProperties from "@/hooks/useGetOwnerSellingProperties";
import useGetOwnerServices from "@/hooks/useGetOwnerServices";
import useGetOwnerShops from "@/hooks/useGetOwnerShops";
import { useRouter } from "next/navigation";

export default function HeroUserProfile() {
  const router = useRouter();

  // 🧩 Fetch all user data through hooks
  useGetOwnerRentedProperties();
  useGetOwnerSellingProperties();
  useGetOwnerServices();
  useGetOwnerShops();

  const { user, ownerRentedProperties, ownerSellingProperties, ownerAllServices, ownerAllShops } =
    useSelector((store) => store.auth);

  const ratingDistribution = [
    { stars: 5, count: 26 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  const reviews = [
    {
      id: 1,
      rating: 5,
      comment:
        "Rahul and his team did an amazing job fixing the electrical issues in my home. They were professional, on time, and very knowledgeable.",
      userName: "Karan",
      userImage:
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Cover */}
      <div
        className="w-full h-48 md:h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            user?.coverPhoto ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          }')`,
        }}
      ></div>

      {/* Main Content */}
      <main>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
            {/* Profile Image */}
            <div className="w-36 h-36 rounded-lg overflow-hidden border-4 border-white shadow-md">
              <Image
                src={
                  user?.profilePhoto ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                }
                alt="Profile"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 mt-6 md:mt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <div>
                    <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                    <p className="text-gray-600">{user?.uniqueId}</p>
                  </div>
                  {user?.isSubscribed && (
                    <div className="ml-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                        <Check size={14} color="white" />
                      </span>
                    </div>
                  )}
                </div>
                <EditProfileDialog>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer">
                    Edit Profile
                  </button>
                </EditProfileDialog>
              </div>

              {/* Icon Row */}
              <div className="flex space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                  <Star size={18} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                  <Settings size={18} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                  <Award size={18} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mt-8"></div>
        </div>

        {/* Rented Properties */}
        <DynamicSection
          title="Rent Your Property"
          items={ownerRentedProperties}
          onAdd={() => router.push("/create/rentProperties")}
        />

        {/* Shops */}
        <DynamicSection
          title="Post Your Shop"
          items={ownerAllShops}
          onAdd={() => router.push("/create/rentShops")}
        />

        {/* Services */}
        <DynamicSection
          title="Add Your Service"
          items={ownerAllServices}
          onAdd={() => router.push("/create/service")}
        />

        {/* Selling Properties */}
        <DynamicSection
          title="Sell a Property"
          items={ownerSellingProperties}
          onAdd={() => router.push("/create/sellProperties")}
        />

        {/* Reviews Section */}
        <ReviewSection
          averageRating={5.0}
          totalReviews={26}
          ratingDistribution={ratingDistribution}
          reviews={reviews}
        />
      </main>
    </div>
  );
}

/* ✅ Extracted reusable section renderer */
const DynamicSection = ({ title, items, onAdd }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  if (!hasItems) {
    return (
      <div onClick={onAdd} className="cursor-pointer">
        <AddListingSection title={title} />
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {title}
          <Plus
            size={18}
            onClick={onAdd}
            className="text-red-500 ml-2 cursor-pointer hover:scale-110 transition-transform"
          />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {items.map((item, idx) => (
       <PropertyCard
  key={item._id || idx}
  image={item.photos?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
  price={item.price || "N/A"}
  title={item.title || item.name || "Untitled"}
  location={
    item.address
      ? `${item.address.detailedAddress || ""}${item.address.detailedAddress ? ", " : ""}${item.address.city || ""}${item.address.city ? ", " : ""}${item.address.state || ""}`
      : item.location || "No location"
  }
  description={item.description || ""}
  propertyId={item._id} // 👈 new
  type={
    title.includes("Rent")
      ? "rentedProperties"
      : title.includes("Sell")
      ? "sellingProperties"
      : title.includes("Shop")
      ? "shop"
      : "service"
  } // 👈 determine correct API endpoint
  initialVisibility={item.isPublic} // 👈 show actual public status
/>

        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button className="text-red-500 text-sm font-medium hover:underline cursor-pointer">
          View all
        </button>
      </div>

      <div className="border-b border-gray-200 mt-8"></div>
    </section>
  );
};
