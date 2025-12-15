"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ShortCard from "../ShortCard";
import useGetAllSellingProperties from "@/hooks/public/useGetAllSellingProperties";
import { useDispatch, useSelector } from "react-redux";
import { Building2, RefreshCcw } from "lucide-react";
import { setSelectedProperty } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

export default function HomeSellProperties({ filters }) {
  // ✅ Fetch properties
  useGetAllSellingProperties();
  const { sellingProperties } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ Carousel autoplay plugin
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  // ✅ Apply filter (state, city, locality)
  const filteredProperties = React.useMemo(() => {
    if (!sellingProperties) return [];

    return sellingProperties.filter((property) => {
      const { address } = property || {};
      const state = address?.state?.toLowerCase() || "";
      const city = address?.city?.toLowerCase() || "";
      const locality = address?.detailedAddress?.toLowerCase() || "";

      const stateMatch = filters?.state
        ? state.includes(filters.state.toLowerCase())
        : true;
      const cityMatch = filters?.city
        ? city.includes(filters.city.toLowerCase())
        : true;
      const localityMatch = filters?.locality
        ? locality.includes(filters.locality.toLowerCase())
        : true;

      return stateMatch && cityMatch && localityMatch;
    });
  }, [sellingProperties, filters]);

  const hasProperties = filteredProperties && filteredProperties.length > 0;

  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-[#fafafa] to-[#f8f8f8]">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-8 md:px-12">
        {/* Section Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Sell Properties
          </h2>
        </div>

        {/* ✅ No Results */}
        {!hasProperties ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              {sellingProperties?.length
                ? "No matching properties found"
                : "No properties available for sale"}
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              {sellingProperties?.length
                ? "Try changing your filter criteria or clear filters."
                : "Currently, there are no properties available for sale. Please check back later or refresh the page to see new listings."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 flex items-center gap-2 px-5 py-2 rounded-md border border-[#eb4c60] text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white transition cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* ✅ Carousel */}
            <div className="relative">
              <Carousel
                plugins={[plugin.current]}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {filteredProperties.map((property, index) => (
                    <CarouselItem
                      key={property._id || index}
                      className="
                        pl-2 md:pl-4
                        basis-full
                        sm:basis-1/2
                        md:basis-1/2
                        lg:basis-1/3
                        xl:basis-1/4
                        flex justify-center
                      "
                    >
                      <ShortCard
                        onClick={() => {
                          dispatch(setSelectedProperty(property));
                          router.push(`/sellProperty/${property._id}`);
                        }}
                        image={property?.photos?.[0] || "/shortCard.png"}
                        title={property?.title || "Untitled Property"}
                        address={`${property?.address?.city || ""}${
                          property?.address?.state
                            ? ", " + property.address.state
                            : ""
                        }`}
                        description={
                          property?.description || "No description available."
                        }
                        ownerPhoto={
                          property?.ownerId?.profilePhoto ||
                          "https://randomuser.me/api/portraits/men/32.jpg"
                        }
                        ownerName={property?.owner?.fullName || "Unknown Owner"}
                        isVerified={property?.isPublic}
                        price={property?.price ? Number(property.price) : null}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Buttons */}
                <CarouselPrevious className="hidden cursor-pointer sm:flex absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-md border hover:bg-[#eb4c60] hover:text-white transition" />
                <CarouselNext className="hidden cursor-pointer sm:flex absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-md border hover:bg-[#eb4c60] hover:text-white transition" />
              </Carousel>
            </div>

            {/* ✅ View All Link */}
            <div className="relative flex items-center justify-center mt-10">
              <span className="block w-1/3 h-[2px] bg-gray-300 rounded-full"></span>
              <button className="mx-4 text-[#eb4c60] font-semibold hover:underline text-base cursor-pointer">
                View all
              </button>
              <span className="block w-1/3 h-[2px] bg-gray-300 rounded-full"></span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
