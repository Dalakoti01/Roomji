import { setAdminAllServices } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const useGetAdminServices = () => {
 const dispatch = useDispatch();
 useEffect(() => {
    const fetchAllShops = async () => {
        try {
            const res = await axios.get('/api/admin/getProperties',{withCredentials : true});
            if(res.data.success){
                toast.success(res.data.message);
                dispatch(setAdminAllServices(res.data.services));
            } else{
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch rented properties");
        }
    }
    fetchAllShops()
 },[dispatch])
}

export default useGetAdminServices