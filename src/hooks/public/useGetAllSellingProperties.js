import { setSellingProperties } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAllSellingProperties = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSellingProperties = async () => {
            try {
                const res = await axios.get('/api/public/getAllSellingProperties');
                if(res.data.success){
                    dispatch(setSellingProperties(res.data.allSellingProperties))
                } else{
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchSellingProperties()
    },[dispatch])
}

export default useGetAllSellingProperties