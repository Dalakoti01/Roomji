"use client";

import Image from "next/image";
import { CheckCircle2, IndianRupee } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ShortCard({
  image = "/shortCard.png",
  title = "Modern Apartment Include Garden",
  address = "Alpha 2, Greater Noida, India",
  description = "description and more things like that",
  ownerPhoto = "https://randomuser.me/api/portraits/men/32.jpg",
  ownerName = "Ashish Kumar",
  isVerified = true,
  price,

  // 👇 new optional props for custom dimensions
  cardWidth = "310px",
  cardHeight = "373px",

  // 👇 ADD THIS: onClick handler
  onClick,
}) {
  return (
    <div
      onClick={onClick} // 👈 attach the onClick event
      className={`cursor-pointer bg-white rounded-[10px] shadow-md overflow-hidden flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-200`}
      style={{
        width: cardWidth,
        height: cardHeight,
        flexShrink: 0,
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Image Section */}
      <div className="relative w-full h-[200px] rounded-t-[10px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 310px"
        />

        {price && (
          <div className="absolute flex bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium px-3 py-1 rounded-md shadow-sm">
            <IndianRupee size={18}/>{price.toLocaleString()} / mon
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{address}</p>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mt-4 mb-2" />

        {/* Owner Info */}
        <div className="flex items-center justify-start gap-3">
          <Avatar className="rounded-full object-cover border">
            <AvatarImage src={ownerPhoto} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-gray-800">{ownerName}</p>
            {isVerified && <CheckCircle2 className="w-4 h-4 text-[#eb4c60]" />}
          </div>
        </div>
      </div>
    </div>
  );
}
