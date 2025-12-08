"use client";

import React from "react";
import Image from "next/image";
import { Award, Settings, ShieldCheck, Star, Check } from "lucide-react";
import EditProfileDialog from "./EditProfileDialog";
import PropertyFullCard from "./PropertyFullCard";

export default function HeroAllRentedProperties() {

const arr = [1,2,3,4]
  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Cover */}
      <div
        className="w-full h-48 md:h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      ></div>

      {/* Main Content */}
      <main>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
            {/* Profile Image */}
            <div className="w-36 h-36 rounded-lg overflow-hidden border-4 border-white shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                alt="Profile"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 mt-6 md:mt-16">
              {/* Name + Edit Button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <div>
                    <h1 className="text-2xl font-bold">Ashish Kumar</h1>
                    <p className="text-gray-600">#38430019</p>
                  </div>
                  <div className="ml-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                      <Check size={14} color="white" />
                    </span>
                  </div>
                </div>

                <EditProfileDialog>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer">
                    Edit Profile
                  </button>
                </EditProfileDialog>
              </div>

              {/* Icon Row */}
              <div className="flex space-x-4">
                {[Star, Settings, Award, ShieldCheck].map((Icon, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                  >
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mt-8"></div>
        </div>

        <div className="flex flex-col justify-center items-center gap-7 mx-25 mt-5">
{arr.map((a) => (<PropertyFullCard/>))
}        </div>
      </main>
    </div>
  );
}
