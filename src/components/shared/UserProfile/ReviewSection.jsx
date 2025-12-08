"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

// ⭐ Star rating component
export function StarRating({ rating = 0, size = 16, onSelect }) {
  const stars = Array.from({ length: 5 });

  return (
    <div className="flex items-center">
      {stars.map((_, i) => (
        <Star
          key={i}
          size={size}
          onClick={() => onSelect && onSelect(i + 1)}
          className={cn(
            "mr-1 cursor-pointer transition",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
          )}
        />
      ))}
    </div>
  );
}

// ⭐ Main component
export default function ReviewSection({
  averageRating,
  totalReviews,
  ratingDistribution,
  reviews,
  showReviewForm = false,
}) {
  const { ownersProfile } = useSelector((store) => store.auth);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Submit review handler
  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      toast.error("Please provide a rating and review.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`/api/giveRating/owner/${ownersProfile?._id}`, {
        rating,
        comment: reviewText,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setReviewText("");
        setRating(0);
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-xl font-bold mb-6">Ratings and Reviews</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div className="md:w-1/3">
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">/ {totalReviews}</span>
          </div>

          <div className="flex items-center mb-2">
            <StarRating rating={5} size={16} />
            <span className="ml-2 text-sm text-gray-500">
              {totalReviews} reviews
            </span>
          </div>

          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center mb-2">
              <div className="w-24 flex">
                <StarRating rating={item.stars} size={14} />
              </div>

              <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{
                    width: `${
                      item.count > 0
                        ? (item.count / totalReviews) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <span className="text-sm text-gray-500 w-4 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="md:w-2/3">
          {reviews.map((review) => (
            <div key={review.id} className="mb-8">
              <div className="mb-2">
                <StarRating rating={review.rating} size={16} />
              </div>

              <h3 className="font-medium mb-2">
                {review.rating === 5 && "Love this property I lived for 4 months"}
                {review.rating === 4 && "Great experience with minor issues"}
                {review.rating === 3 && "Average stay, some issues"}
                {review.rating === 2 && "Disappointing experience"}
                {review.rating === 1 && "Very poor service and facilities"}
              </h3>

              <p className="text-gray-600 mb-4">{review.comment}</p>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={review.userImage}
                    alt={review.userName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm">{review.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Public Review Form */}
      {showReviewForm && (
        <div className="mt-8">
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Your Rating:</p>
            <StarRating rating={rating} onSelect={setRating} size={22} />
          </div>

          <textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>

          <button
            onClick={handleSubmitReview}
            disabled={loading}
            className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      <div className="border-b border-gray-200 mt-8"></div>
    </div>
  );
}
