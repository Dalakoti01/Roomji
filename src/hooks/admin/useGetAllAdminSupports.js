import { setAllAdminSupports } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const useGetAllAdminSupports = () => {
    const dispatch = useDispatch();
    useEffect(() => {
       const fetchAllUsersSupportMessages = async () => {
        try {
            const res = await axios.get('/api/admin/getAdminSupport',{withCredentials:true});
            if(res.data.success){
                dispatch(setAllAdminSupports(res.data.users))
                toast.success(res.data.message);
            } else{
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch admin support messages");
        }
       }
       fetchAllUsersSupportMessages()
    },[dispatch])
}

export default useGetAllAdminSupports