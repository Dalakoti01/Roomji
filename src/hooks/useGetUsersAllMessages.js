import { setMessages } from '@/redux/messageSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetUsersAllMessages = ({id}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const res = await axios.get(`/api/user/getMessage/${id}`,{withCredentials : true})
                if(res.data.success){
                    dispatch(setMessages(res.data.messages))
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message)
            }
        }
        fetchAllMessages()
    },[dispatch,id])
}

export default useGetUsersAllMessages