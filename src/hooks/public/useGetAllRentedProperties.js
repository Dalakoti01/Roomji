import { setRentedProperties } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllRentedProperties = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchRentedProperties = async () => {
      try {
        const res = await axios.get("/api/public/getAllRentedProperties", {
          headers: {
            "Cache-Control": "no-store",
          },
        });
        if (res.data.success) {
          dispatch(setRentedProperties(res.data.allRentedProperties));
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRentedProperties();
  }, [dispatch]);
};

export default useGetAllRentedProperties;
