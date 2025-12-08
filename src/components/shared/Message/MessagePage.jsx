"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetChattingUsers } from "@/hooks/useGetChattingUsers";
import { setCurrentChat } from "@/redux/messageSlice";

export default function MessagePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  useGetChattingUsers();

  const { chattingUsers = [] } = useSelector((store) => store.messages || {});

  const handleOpenChat = (chat) => {
    dispatch(setCurrentChat(chat)); // ✅ store current chat user
    router.push(`/user/message/${chat._id}`); // ✅ navigate to chat
  };

  return (
    <div className="flex h-[90vh] bg-gray-50 rounded-xl shadow-md overflow-hidden">
      {/* LEFT SIDE - CHAT LIST */}
      <div className="w-full md:w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="text-gray-400" size={18} />
          <Input placeholder="Search chat..." className="border-none focus-visible:ring-0" />
        </div>

        <div className="overflow-y-auto">
          {chattingUsers.length > 0 ? (
            chattingUsers.map((chat) => (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleOpenChat(chat)}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <img
                  src={chat?.profilePhoto || "https://via.placeholder.com/40x40.png?text=User"}
                  alt={chat?.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{chat?.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">{chat?.lastMsg || "Hello"}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center flex-1 text-center p-10 text-gray-500">
              <MessageSquare size={60} className="text-[#eb4c60] mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No conversations yet</h2>
              <p className="max-w-md text-gray-500">
                Start chatting with doctors or users to see your conversations here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Placeholder */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center text-gray-500">
        <MessageSquare size={60} className="text-[#eb4c60] mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No chat selected</h2>
        <p className="max-w-md text-gray-500 text-center">
          Choose a conversation from the left panel to start chatting. Your messages will appear here.
        </p>
      </div>
    </div>
  );
}
