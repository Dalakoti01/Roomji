"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProperty } from "@/redux/authSlice";

const ReviewsSection = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { selectedProperty } = useSelector((store) => store.auth);
  const dispatch = useDispatch()
const handleSubmitReview = async () => {
  if (!rating || !feedback.trim()) {
    toast.error("Please provide a rating and feedback.");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(`/api/giveRating/service/${id}`, {
      rating,
      feedback,
    });

    if (res.data.success) {
      const { latestReview, overallratings } = res.data;

      // ✅ Append the new review and update overallratings dynamically
      dispatch(
        setSelectedProperty({
          ...selectedProperty,
          overallratings,
          reviews: [
            ...selectedProperty.reviews,
            {
              ...latestReview,
              userId: {
                _id: latestReview.userId,
                fullName: "You", // temporary name — optional
                profilePhoto: selectedProperty.currentUser?.profilePhoto || "", // if available
              },
            },
          ],
        })
      );

      toast.success(res.data.message);
      setOpen(false);
      setFeedback("");
      setRating(0);
    } else {
      toast.error(res.data.message || "Failed to submit review");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  // Default profile photo if not available
  const defaultProfile =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1180&q=80";

  return (
    <div className="my-10 w-full max-w-3xl mx-auto">
      {/* Section Title */}
      <h2 className="text-xl font-bold mb-6">Ratings and Reviews</h2>

      {/* Overall Rating Summary */}
      <div className="flex items-center mb-8">
        <div className="text-3xl font-bold mr-2">{selectedProperty?.overallratings}</div>
        <div className="text-xl text-gray-500">
          /{selectedProperty?.reviews?.length || 0}
        </div>
        <div className="flex ml-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-[#eb4c60] fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <div className="ml-2 text-sm text-gray-500">
          {selectedProperty?.reviews?.length || 0} reviews
        </div>
      </div>

      {/* Dynamic Reviews List */}
      <div className="space-y-8">
        {selectedProperty?.reviews?.length > 0 ? (
          selectedProperty.reviews.map((review, idx) => (
            <div key={idx} className="border-b pb-8">
              {/* Star Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (review.rating || 0)
                          ? "text-[#eb4c60]"
                          : "text-gray-300"
                      } fill-current`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <h3 className="font-bold text-lg mb-2">
                {review.feedbackTitle || "User Review"}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {review.feedback}
              </p>

              {/* User Info */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={
                      review.userId?.profilePhoto
                        ? review.userId.profilePhoto
                        : defaultProfile
                    }
                    alt={review.userId?.fullName || "User"}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-medium">
                  {review.userId?.fullName || "Anonymous"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No reviews yet. Be the first to write one!
          </p>
        )}
      </div>

      {/* Write a Review Button */}
      <Button
        className="mt-6 w-full bg-[#eb4c60] hover:bg-[#d43b4f] text-white py-3 rounded-md transition cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Write a review
      </Button>

      {/* Review Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Write a Review
            </DialogTitle>
          </DialogHeader>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className={`w-8 h-8 cursor-pointer transition ${
                  star <= (hovered || rating)
                    ? "text-[#eb4c60] fill-current"
                    : "text-gray-300"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>

          {/* Feedback Textarea */}
          <textarea
            className="w-full border rounded-md p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#eb4c60]"
            rows={4}
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          {/* Submit Button */}
          <Button
            disabled={loading}
            onClick={handleSubmitReview}
            className="mt-4 w-full bg-[#eb4c60] hover:bg-[#d43b4f] text-white py-2 rounded-md transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsSection;
