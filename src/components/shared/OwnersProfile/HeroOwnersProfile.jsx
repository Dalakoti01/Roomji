"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Star, Mail, Phone, Instagram, Facebook } from "lucide-react";
import useGetOwnersProfile from "@/hooks/useGetOwnersProfile";
import PropertyCard from "../UserProfile/PropertyCard";
import ReviewSection from "../UserProfile/ReviewSection";

export default function HeroOwnersProfile() {
  const { id } = useParams();
  useGetOwnersProfile({ id });

  const {
    ownersProfile,
    ownerRentedProperties,
    ownerSellingProperties,
    ownerAllServices,
    ownerAllShops,
  } = useSelector((store) => store.auth);

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
        "One of the best landlords in the area — responsive, helpful and very professional.",
      userName: "Karan Dalakoti",
      userImage:
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image */}
      <div
        className="w-full h-48 md:h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            ownersProfile?.coverPhoto ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          }')`,
        }}
      ></div>

      <main>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
            {/* Profile Photo */}
            <div className="w-36 h-36 rounded-lg overflow-hidden border-4 border-white shadow-md">
              <Image
                src={
                  ownersProfile?.profilePhoto ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                }
                alt="Owner Profile"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 mt-6 md:mt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <div>
                    <h1 className="text-2xl font-bold">{ownersProfile?.fullName}</h1>
                    <p className="text-gray-600">{ownersProfile?.uniqueId}</p>
                  </div>
                  {ownersProfile?.isSubscribed && (
                    <div className="ml-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                        <Star size={14} color="white" fill="white" />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact / Social Icons */}
              <div className="flex space-x-4 mt-2">
                <a href={`mailto:${ownersProfile?.email || "#"}`} target="_blank" rel="noopener noreferrer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                    <Mail size={18} />
                  </div>
                </a>

                <a href={`https://wa.me/${ownersProfile?.phoneNumber || ""}`} target="_blank" rel="noopener noreferrer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                    <Phone size={18} />
                  </div>
                </a>

                <a href={ownersProfile?.instagram || "#"} target="_blank" rel="noopener noreferrer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                    <Instagram size={18} />
                  </div>
                </a>

                <a href={ownersProfile?.facebook || "#"} target="_blank" rel="noopener noreferrer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                    <Facebook size={18} />
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mt-8"></div>
        </div>

        {/* ---- Sections ---- */}

        <PublicSection title="Rented Properties" items={ownerRentedProperties} />
        <PublicSection title="Shops" items={ownerAllShops} />
        <PublicSection title="Services" items={ownerAllServices} />
        <PublicSection title="Properties for Sale" items={ownerSellingProperties} />

        <ReviewSection
          averageRating={5.0}
          totalReviews={26}
          ratingDistribution={ratingDistribution}
          reviews={reviews}
          showReviewForm={true} // ✅ New argument for review form
        />
      </main>
    </div>
  );
}

/* ✅ Reusable PublicSection for cards (no add button) */
const PublicSection = ({ title, items }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  if (!hasItems) return null;

  return (
    <section className="container mx-auto px-6 py-6">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            showToggle={false} // ✅ Hide toggle for public view
          />
        ))}
      </div>
    </section>
  );
};
