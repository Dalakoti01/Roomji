import {
  setAdminReportedRentedProperties,
  setAdminReportedSellingProperties,
  setAdminReportedServices,
  setAdminReportedShops,
} from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAdminReportedProperties = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllSellingProperties = async () => {
      try {
        const res = await axios.get("/api/admin/getReportedProperties", {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(
            setAdminReportedSellingProperties(res.data.sellingProperties)
          );
          dispatch(setAdminReportedRentedProperties(res.data.rentedProperties));
          dispatch(setAdminReportedServices(res.data.services));
          dispatch(setAdminReportedShops(res.data.shops));
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch rented properties");
      }
    };
    fetchAllSellingProperties();
  }, [dispatch]);
};

export default useGetAdminReportedProperties;
