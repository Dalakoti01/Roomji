"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Feedback = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/api/user/feedback", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        setFormData({ fullName: "", email: "", feedback: "" });
        toast.success(res.data.message);
      
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  mx-auto bg-white rounded-md p-4 sm:p-6 md:p-8 flex flex-col gap-6"
    >
      <h1 className="font-bold text-2xl sm:text-3xl">Customer Feedback</h1>
      <p className="text-gray-600 text-sm sm:text-base">
        Everything we do is shaped by your feedback, ensuring services that are reliable, personal, and built with you in mind.
      </p>

      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          className="w-full sm:w-2/3 h-12"
          placeholder="Enter Your Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          className="w-full sm:w-2/3 h-12"
          placeholder="Enter Your Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Feedback</Label>
        <Textarea
          className="w-full sm:w-2/3 min-h-[120px] sm:min-h-[150px]"
          placeholder="Enter Your Feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
        />
      </div>

      {loading ? (
        <Button
          type="submit"
          className="bg-[#eb4c60] w-full sm:w-1/2 h-12 text-white flex items-center justify-center gap-2"
          variant="outline"
          disabled
        >
          <Loader2 className="animate-spin h-4 w-4" />
          Submitting...
        </Button>
      ) : (
        <Button
          type="submit"
          className="bg-[#eb4c60] cursor-pointer w-full sm:w-1/2 h-12 text-white"
          variant="outline"
        >
          Submit Feedback
        </Button>
      )}
    </form>
  );
};

export default Feedback;
