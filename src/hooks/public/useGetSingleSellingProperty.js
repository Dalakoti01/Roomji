import { setSelectedProperty } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetSingleSellingProperty = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!id) return; // prevents running if id is undefined

    const fetchSingleSellingProperty = async () => {
      try {
        const res = await axios.get(`/api/public/getSingleSellingProperty/${id}`);
        if (res.data.success) {
          dispatch(setSelectedProperty(res.data.sellingProperty));
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch rented room details");
      }
    };
    fetchSingleSellingProperty();
  }, [dispatch, id]);
};

export default useGetSingleSellingProperty;
