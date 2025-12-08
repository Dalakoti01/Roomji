"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, Store, Wrench, X, DollarSign } from "lucide-react";

const PostDialog = ({ open, setOpen }) => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return;

    // ✅ Close the dialog first
    setOpen(false);

    // 🧭 Navigate after a small delay to allow the closing animation
    setTimeout(() => {
      if (selected === "Rent Properties") router.push("/create/rentProperties");
      else if (selected === "Sell Properties") router.push("/create/sellProperties");
      else if (selected === "shop") router.push("/create/rentShops");
      else if (selected === "service") router.push("/create/service");
    }, 150); // small delay for smooth transition
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button className="bg-[#eb4c60] hover:bg-[#d43c50] text-white">
          Post
        </Button>
      </DialogTrigger> */}

      <DialogContent className="max-w-3xl w-[90%] sm:w-[85%] rounded-2xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-center w-full text-lg sm:text-xl font-semibold">
            Would you like to Post
          </DialogTitle>
        </DialogHeader>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {/* Rent Properties */}
          <div
            onClick={() => setSelected("Rent Properties")}
            className={`flex flex-col items-center justify-center border rounded-xl p-6 cursor-pointer transition ${
              selected === "Rent Properties"
                ? "border-[#eb4c60] bg-pink-50"
                : "hover:border-[#eb4c60]"
            }`}
          >
            <Home className="w-14 h-14 mb-3 text-gray-800" />
            <p className="font-medium text-center text-gray-800">Rent Properties</p>
          </div>

          {/* Sell Properties */}
          <div
            onClick={() => setSelected("Sell Properties")}
            className={`flex flex-col items-center justify-center border rounded-xl p-6 cursor-pointer transition ${
              selected === "Sell Properties"
                ? "border-[#eb4c60] bg-pink-50"
                : "hover:border-[#eb4c60]"
            }`}
          >
            <DollarSign className="w-14 h-14 mb-3 text-gray-800" />
            <p className="font-medium text-center text-gray-800">Sell Properties</p>
          </div>

          {/* Shops */}
          <div
            onClick={() => setSelected("shop")}
            className={`flex flex-col items-center justify-center border rounded-xl p-6 cursor-pointer transition ${
              selected === "shop"
                ? "border-[#eb4c60] bg-pink-50"
                : "hover:border-[#eb4c60]"
            }`}
          >
            <Store className="w-14 h-14 mb-3 text-gray-800" />
            <p className="font-medium text-center text-gray-800">Shops</p>
          </div>

          {/* Services */}
          <div
            onClick={() => setSelected("service")}
            className={`flex flex-col items-center justify-center border rounded-xl p-6 cursor-pointer transition ${
              selected === "service"
                ? "border-[#eb4c60] bg-pink-50"
                : "hover:border-[#eb4c60]"
            }`}
          >
            <Wrench className="w-14 h-14 mb-3 text-gray-800" />
            <p className="font-medium text-center text-gray-800">Services</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleNext}
            disabled={!selected}
            className={`${
              selected
                ? "bg-[#eb4c60] cursor-pointer hover:bg-[#d43c50]"
                : "bg-gray-300 cursor-not-allowed"
            } text-white`}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
