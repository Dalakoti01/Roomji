import { setAdminDashboard } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAdminDashboard = () => {
    const dispatch  = useDispatch();
    useEffect(() => {
        const fetchAdminDashboardData = async () => {
            try {
                const res = await axios.get('/api/admin/dashboardDetails',{withCredentials:true});
                if(res.data.success){
                    toast.success(res.data.message);
                    dispatch(setAdminDashboard(res.data.adminDashboard));
                } else{
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message || "Failed to fetch admin dashboard data");
            }
        }
        fetchAdminDashboardData();

    },[dispatch])
}

export default useGetAdminDashboard