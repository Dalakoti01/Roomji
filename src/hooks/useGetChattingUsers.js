import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setChattingUser } from "@/redux/messageSlice";

export const useGetChattingUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/user/getChattingUsers");
        dispatch(setChattingUser(res.data.chattingUsers));
      } catch (error) {
        console.error("Error fetching chatting users:", error);
      }
    };
    fetchUsers();
  }, [dispatch]);
};
