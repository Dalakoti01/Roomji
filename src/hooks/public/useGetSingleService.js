import { setSelectedProperty } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetSingleService = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!id) return; // prevents running if id is undefined

    const fetchSingleService = async () => {
      try {
        const res = await axios.get(`/api/public/getSingleService/${id}`);
        if (res.data.success) {
          dispatch(setSelectedProperty(res.data.service));
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch rented room details");
      }
    };
    fetchSingleService();
  }, [dispatch, id]);
};

export default useGetSingleService;
