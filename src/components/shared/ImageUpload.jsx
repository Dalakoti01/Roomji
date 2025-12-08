"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ImageUpload({ onChange }) {
  const [images, setImages] = useState([]);

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...images, file];
      setImages(newImages);
      onChange && onChange(newImages); // ✅ send files to parent
    }
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onChange && onChange(updated);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upload Images
      </h2>

      {/* Image Grid */}
      <div className="flex flex-wrap gap-4">
        {images.map((file, index) => {
          const imageUrl =
            typeof file === "string" ? file : URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="relative w-64 h-40 rounded-md overflow-hidden shadow-sm"
            >
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full cursor-pointer"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          );
        })}

        {/* Add Image */}
        <label
          htmlFor="file-upload"
          className={cn(
            "w-64 h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          )}
        >
          <Plus className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">Add Image</span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAddImage}
          />
        </label>
      </div>

      <p className="text-sm text-gray-500 mt-3">
        Upload high-quality images (max 5)
      </p>
    </div>
  );
}
