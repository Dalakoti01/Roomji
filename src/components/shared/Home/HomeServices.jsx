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
import useGetAllServices from "@/hooks/public/useGetAllServices";
import { useSelector } from "react-redux";
import { Wrench, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeServices({ filters }) {
  const router = useRouter();
  useGetAllServices();
  const { allServices } = useSelector((store) => store.auth);
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  // ✅ Apply filters (state, city, locality)
  const filteredServices = React.useMemo(() => {
    if (!allServices) return [];

    return allServices.filter((service) => {
      const { address } = service || {};
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
  }, [allServices, filters]);

  const hasServices = filteredServices && filteredServices.length > 0;

  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-[#fafafa] to-[#f8f8f8]">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-8 md:px-12">
        {/* Section Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Services Near You
          </h2>
        </div>

        {/* ✅ No Services Found */}
        {!hasServices ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Wrench className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              {allServices?.length
                ? "No matching services found"
                : "No services available"}
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              {allServices?.length
                ? "Try changing your filter criteria or clear filters."
                : "Currently, there are no services listed near you. Please check back later or refresh to see new updates."}
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
                  {filteredServices.map((service, index) => (
                    <CarouselItem
                      key={service._id || index}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex justify-center"
                    >
                      <ShortCard
                        onClick={() => router.push(`/service/${service._id}`)}
                        image={service?.photos?.[0] || "/serviceCard.png"}
                        title={service?.title || "Untitled Service"}
                        address={`${service?.address?.city || ""}${
                          service?.address?.state
                            ? ", " + service.address.state
                            : ""
                        }`}
                        description={
                          service?.description || "No description provided."
                        }
                        ownerPhoto={
                          service?.ownerId?.profilePhoto ||
                          "https://randomuser.me/api/portraits/men/32.jpg"
                        }
                        ownerName={service?.owner?.fullName || "Unknown Provider"}
                        isVerified={service?.isPublic}
                        price={
                          service?.price
                            ? Number(service.price)
                            : service?.owner?.price
                            ? Number(service.owner.price)
                            : null
                        }
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
