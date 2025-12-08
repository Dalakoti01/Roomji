import { setOwnerAllShops } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const useGetOwnerShops = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOwnerShops = async () => {
      try {
        const res = await axios.get('/api/owner/getAllShops', { withCredentials: true });
        if (res.data.success) {
          dispatch(setOwnerAllShops(res.data.ownerShops));
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOwnerShops();
  }, [dispatch]);
};

export default useGetOwnerShops;
