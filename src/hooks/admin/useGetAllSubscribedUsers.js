import { setAllSubscribedUsers } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllSubscribedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllSubscribedUsers = async () => {
      try {
        const res = await axios.get("/api/admin/getSubscribedUsers", {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(setAllSubscribedUsers(res.data.subscribedUsers));
        } else{
            toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch subscribed users");
      }
    };
    fetchAllSubscribedUsers()
  }, [dispatch]);
};

export default useGetAllSubscribedUsers;
