import {  setOwnerSellingProperties } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetOwnerSellingProperities = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOwnerRentedProperties = async () => {
            try {
                const res = await axios('/api/owner/getAllSellingProperties',{withCredentials:true});
                if(res.data.success){
                    dispatch(setOwnerSellingProperties(res.data.ownerSellingProperties));
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchOwnerRentedProperties()
    },[dispatch])
}

export default useGetOwnerSellingProperities