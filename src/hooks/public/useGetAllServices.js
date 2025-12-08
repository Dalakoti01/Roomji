import { setAllServices } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAllServices = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                const res = await axios.get('/api/public/getAllServices');
                if(res.data.success){
                    dispatch(setAllServices(res.data.allServices))
                } else{
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllServices()
    },[dispatch])
}

export default useGetAllServices