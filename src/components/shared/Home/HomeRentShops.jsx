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
import useGetAllShops from "@/hooks/public/useGetAllShops";
import { useSelector } from "react-redux";
import { Store, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeRentShops({ filters }) {
  const router = useRouter();
  useGetAllShops();
  const { allShops } = useSelector((store) => store.auth);
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  // ✅ Filter by state, city, locality (case-insensitive)
  const filteredShops = React.useMemo(() => {
    if (!allShops) return [];

    return allShops.filter((shop) => {
      const { address } = shop || {};
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
  }, [allShops, filters]);

  const hasShops = filteredShops && filteredShops.length > 0;

  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-[#fafafa] to-[#f8f8f8]">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-8 md:px-12">
        {/* Section Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Rent Shops
          </h2>
        </div>

        {/* ✅ If No Shops */}
        {!hasShops ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Store className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              {allShops?.length
                ? "No matching shops found"
                : "No shops available for rent"}
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              {allShops?.length
                ? "Try changing your filter criteria or clear filters."
                : "Currently, there are no shops listed for rent. Please check back later or refresh to see new listings."}
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
                  {filteredShops.map((shop, index) => (
                    <CarouselItem
                      key={shop._id || index}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex justify-center"
                    >
                      <ShortCard
                        onClick={() => router.push(`/rentShop/${shop._id}`)}
                        image={shop?.photos?.[0] || "/cardShop.png"}
                        title={shop?.title || "Untitled Shop"}
                        address={`${shop?.address?.city || ""}${
                          shop?.address?.state ? ", " + shop.address.state : ""
                        }`}
                        description={shop?.description || "No description available."}
                        ownerPhoto={
                          shop?.owner?.profilePhoto ||
                          "https://randomuser.me/api/portraits/men/32.jpg"
                        }
                        ownerName={shop?.owner?.fullName || "Unknown Owner"}
                        isVerified={shop?.isPublic}
                        price={shop?.price ? Number(shop.price) : null}
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
