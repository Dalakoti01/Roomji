"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

/* ----------------------------------------
   ⭐ Helper Functions (IMPORTANT)
---------------------------------------- */

const getAverageRating = (reviews = []) => {
  if (!reviews.length) return 0;
  const total = reviews.reduce(
    (sum, r) => sum + (r.rating || 0),
    0
  );
  return total / reviews.length;
};

const getRatingDistribution = (reviews = []) => {
  const distribution = [1, 2, 3, 4, 5].map((star) => ({
    stars: star,
    count: 0,
  }));

  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating - 1].count += 1;
    }
  });

  return distribution.reverse(); // 5⭐ → 1⭐
};

/* ----------------------------------------
   ⭐ Star Rating Component
---------------------------------------- */

export function StarRating({ rating = 0, size = 16, onSelect }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          onClick={() => onSelect && onSelect(i + 1)}
          className={cn(
            "mr-1 transition cursor-pointer",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 hover:text-yellow-400"
          )}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------
   ⭐ Main Review Section
---------------------------------------- */

export default function ReviewSection({ showReviewForm = false }) {
  const { ownersProfile } = useSelector((store) => store.auth);

  const reviews = ownersProfile?.reviews || [];

  const totalReviews = reviews.length;

  const averageRating = useMemo(
    () => getAverageRating(reviews),
    [reviews]
  );

  const ratingDistribution = useMemo(
    () => getRatingDistribution(reviews),
    [reviews]
  );

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ✅ Submit Review */
  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      toast.error("Please provide a rating and review.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `/api/giveRating/owner/${ownersProfile?._id}`,
        { rating, feedback: reviewText }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setReviewText("");
        setRating(0);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-xl font-bold mb-6">
        Ratings and Reviews
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ⭐ Left Summary */}
        <div className="md:w-1/3">
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 ml-1">
              / {totalReviews}
            </span>
          </div>

          {ratingDistribution.map((item) => (
            <div
              key={item.stars}
              className="flex items-center mb-2"
            >
              <div className="w-24">
                <StarRating rating={item.stars} size={14} />
              </div>

              <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{
                    width: totalReviews
                      ? `${(item.count / totalReviews) * 100}%`
                      : "0%",
                  }}
                />
              </div>

              <span className="text-sm text-gray-500 w-4 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* ⭐ Reviews List */}
        <div className="md:w-2/3">
          {reviews.length === 0 && (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          )}

          {reviews.map((review, idx) => (
            <div key={idx} className="mb-8">
              <StarRating rating={review.rating} size={16} />

              <p className="text-gray-600 my-3">
                {review.feedback}
              </p>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={
                      review.userId?.profilePhoto ||
                      "/default-avatar.png"
                    }
                    alt={review.userId?.fullName || "User"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>

                <span className="text-sm">
                  {review.userId?.fullName || "Anonymous"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ Review Form */}
      {showReviewForm && (
        <div className="mt-8">
          <p className="text-sm font-medium mb-2">
            Your Rating
          </p>

          <StarRating
            rating={rating}
            onSelect={setRating}
            size={22}
          />

          <textarea
            className="w-full border rounded-lg p-3 mt-4"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <button
            onClick={handleSubmitReview}
            disabled={loading}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
