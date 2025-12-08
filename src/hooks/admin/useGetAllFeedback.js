import { setAllFeedbacks } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllFeedback = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllUsersFeedback = async () => {
      try {
        const res = await axios.get("/api/admin/getAllFeedbacks", {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(setAllFeedbacks(res.data.users));
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while fetching feedbacks");
      }
    };
    fetchAllUsersFeedback()
  }, [dispatch]);
};

export default useGetAllFeedback;
