import { setAllUsers } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAllUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllUsers = async () => {
        try {
            const res = await axios.get('/api/admin/getAllUsers',{withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
                dispatch(setAllUsers(res.data.allUsers));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Failed to fetch all users data");
        }
    }
    fetchAllUsers()
  },[dispatch])
}

export default useGetAllUsers