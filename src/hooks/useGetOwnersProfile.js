import {
  setOwnerAllServices,
  setOwnerAllShops,
  setOwnerRentedProperties,
  setOwnerSellingProperties,
  setOwnersProfile,
} from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetOwnersProfile = ({ id }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!id) return;
    const fetchOwnersProfile = async () => {
      try {
        const res = await axios.get(`/api/getOwnerProfile/${id}`);
        if (res.data.success) {
          dispatch(setOwnersProfile(res.data.ownerProfile));
          dispatch(setOwnerRentedProperties(res.data.rentedProperties));
          dispatch(setOwnerSellingProperties(res.data.sellingProperties));
          dispatch(setOwnerAllServices(res.data.services));
          dispatch(setOwnerAllShops(res.data.shops));
          toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwnersProfile();
  }, [dispatch, id]);
};

export default useGetOwnersProfile;
