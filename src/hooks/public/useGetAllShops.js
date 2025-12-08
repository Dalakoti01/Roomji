import { setAllShops } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAllShops = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllShops = async () => {
            try {
                const res = await axios.get('/api/public/getAllShops');
                if(res.data.success){
                    dispatch(setAllShops(res.data.allShops))
                } else{
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllShops()
    },[dispatch])
}

export default useGetAllShops