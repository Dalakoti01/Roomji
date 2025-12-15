"use client";

import React from "react";
import { Plus, Star, Settings, Award, ShieldCheck, Check } from "lucide-react";
import ProfileSection from "./ProfileSection";
import PropertyCard from "./PropertyCard";
import AddListingSection from "./AddListingSection";
import ReviewSection from "./ReviewSection";
import Image from "next/image";
import EditProfileDialog from "./EditProfileDialog";
import { useSelector } from "react-redux";
import useGetOwnerRentedProperties from "@/hooks/useGetOwnerRentedProperties";
import useGetOwnerSellingProperties from "@/hooks/useGetOwnerSellingProperties";
import useGetOwnerServices from "@/hooks/useGetOwnerServices";
import useGetOwnerShops from "@/hooks/useGetOwnerShops";
import { useRouter } from "next/navigation";

export default function HeroUserProfile() {
  const router = useRouter();

  // 🔄 Fetch owner data
  useGetOwnerRentedProperties();
  useGetOwnerSellingProperties();
  useGetOwnerServices();
  useGetOwnerShops();

  const {
    user,
    ownerRentedProperties,
    ownerSellingProperties,
    ownerAllServices,
    ownerAllShops,
  } = useSelector((store) => store.auth);

  /* -------------------- ⭐ Reviews Logic -------------------- */

  const totalReviews = user?.reviews?.length || 0;
  const averageRating = user?.overallratings || 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: user?.reviews?.filter((r) => r.rating === star).length || 0,
  }));

  const reviews = (user?.reviews || []).map((r, idx) => ({
    id: idx,
    rating: r.rating,
    comment: r.feedback,
    userName: user?.fullName || "Anonymous",
    userImage:
      user?.profilePhoto ||
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80",
  }));

  /* ---------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Cover */}
      <div
        className="w-full h-48 md:h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            user?.coverPhoto ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80"
          }')`,
        }}
      />

      <main>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
            {/* Profile Image */}
            <div className="w-36 h-36 rounded-lg overflow-hidden border-4 border-white shadow-md">
              <Image
                src={
                  user?.profilePhoto ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80"
                }
                alt="Profile"
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 mt-6 md:mt-16">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div>
                    <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                    <p className="text-gray-600">{user?.uniqueId}</p>
                  </div>
                  {user?.isSubscribed && (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                      <Check size={14} color="white" />
                    </span>
                  )}
                </div>

                <EditProfileDialog>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer">
                    Edit Profile
                  </button>
                </EditProfileDialog>
              </div>

              {/* Icons */}
              <div className="flex space-x-4">
                {[Star, Settings, Award, ShieldCheck].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                  >
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mt-8" />
        </div>

        {/* Dynamic Sections */}
        <DynamicSection
          title="Rent Your Property"
          items={ownerRentedProperties}
          onAdd={() => router.push("/create/rentProperties")}
        />

        <DynamicSection
          title="Post Your Shop"
          items={ownerAllShops}
          onAdd={() => router.push("/create/rentShops")}
        />

        <DynamicSection
          title="Add Your Service"
          items={ownerAllServices}
          onAdd={() => router.push("/create/service")}
        />

        <DynamicSection
          title="Sell a Property"
          items={ownerSellingProperties}
          onAdd={() => router.push("/create/sellProperties")}
        />

        {/* ⭐ Reviews */}
        <ReviewSection
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingDistribution={ratingDistribution}
          reviews={reviews}
          emptyMessage="Currently there are no reviews posted"
        />
      </main>
    </div>
  );
}

/* ---------------- Reusable Section ---------------- */

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
            className="text-red-500 cursor-pointer hover:scale-110"
          />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <PropertyCard
            key={item._id || idx}
            image={item.photos?.[0]}
            price={item.price}
            title={item.title || item.name}
            location={
              item.address
                ? `${item.address.detailedAddress || ""}, ${item.address.city || ""}, ${item.address.state || ""}`
                : item.location
            }
            description={item.description}
            propertyId={item._id}
            type={
              title.includes("Rent")
                ? "rentedProperties"
                : title.includes("Sell")
                ? "sellingProperties"
                : title.includes("Shop")
                ? "shop"
                : "service"
            }
            initialVisibility={item.isPublic}
          />
        ))}
      </div>

      <div className="border-b border-gray-200 mt-8" />
    </section>
  );
};
