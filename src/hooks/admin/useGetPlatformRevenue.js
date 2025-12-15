import { setRevenueRecords } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetPlatformRevenue = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await axios.get('/api/admin/getRevenue',{withCredentials : true});
                if(res.data.success){
                    dispatch(setRevenueRecords(res.data.revenue))
                    toast.success(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message)
            }
        }
        fetchRevenue()
    },[dispatch])
}

export default useGetPlatformRevenue