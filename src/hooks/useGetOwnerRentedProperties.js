import { setOwnerRentedProperties } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetOwnerRentedProperities = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOwnerRentedProperties = async () => {
            try {
                const res = await axios('/api/owner/getAllRentedProperties',{withCredentials:true});
                if(res.data.success){
                    dispatch(setOwnerRentedProperties(res.data.ownerRentedProperties));
                } else{
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchOwnerRentedProperties()
    },[dispatch])
}

export default useGetOwnerRentedProperities