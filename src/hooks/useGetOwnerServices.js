import { setOwnerAllServices } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const useGetOwnerServices = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOwnerServices = async () => {
      try {
        const res = await axios.get('/api/owner/getAllServices', { withCredentials: true });
        if (res.data.success) {
          dispatch(setOwnerAllServices(res.data.ownerServices));
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOwnerServices();
  }, [dispatch]);
};

export default useGetOwnerServices;
