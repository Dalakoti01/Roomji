"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useGetChattingUsers } from "@/hooks/useGetChattingUsers";
import useGetUsersAllMessages from "@/hooks/useGetUsersAllMessages";
import { setCurrentChat, setMessages } from "@/redux/messageSlice";

export default function ChatDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [message, setMessage] = useState("");

  // ✅ Fetch chatting users and all messages
  useGetChattingUsers();
  useGetUsersAllMessages({ id });

  // ✅ Redux state
  const { user } = useSelector((store) => store.auth);
  const { chattingUsers = [], currentChat, messages = [] } = useSelector(
    (store) => store.messages || {}
  );

  // ✅ Determine selected chat user
  const selectedUser =
    currentChat ||
    chattingUsers.find((chat) => String(chat._id) === String(id));

  // ✅ Sync Redux currentChat
  useEffect(() => {
    if (selectedUser) dispatch(setCurrentChat(selectedUser));
  }, [id, selectedUser, dispatch]);

  // ✅ Send Message API call
  const handleSend = async () => {
    if (message.trim() === "" || !selectedUser?._id) return;

    // Optimistic UI update (optional local display before re-fetch)
    const newMsg = {
      _id: Date.now(), // temp unique key
      sender: user?._id,
      receiver: selectedUser._id,
      message,
      createdAt: new Date().toISOString(),
    };

    dispatch(setMessages([...messages, newMsg]));
    setMessage("");

    try {
      const res = await axios.post(`/api/user/sendMessage/${selectedUser._id}`, {
        message,
      });

      if (res.data?.success) {
        console.log("✅ Message sent successfully:", res.data);
      } else {
        toast.error(res.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  // ✅ Handle chat switch
  const handleOpenChat = (chat) => {
    dispatch(setCurrentChat(chat));
    router.push(`/user/message/${chat._id}`);
  };

  return (
    <div className="flex h-[90vh] bg-gray-50 rounded-xl shadow-md overflow-hidden">
      {/* LEFT SIDE - CHAT LIST */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="text-gray-400" size={18} />
          <Input
            placeholder="Search chat..."
            className="border-none focus-visible:ring-0"
          />
        </div>

        {/* Chatting Users List */}
        <div className="overflow-y-auto">
          {chattingUsers.length > 0 ? (
            chattingUsers.map((chat) => (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleOpenChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition ${
                  String(chat._id) === String(id)
                    ? "bg-[#eb4c60]/10"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={
                    chat.profilePhoto ||
                    "https://via.placeholder.com/40x40.png?text=User"
                  }
                  alt={chat.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{chat?.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat?.lastMsg || "Start a conversation"}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center flex-1 text-center p-10 text-gray-500">
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - CHAT SECTION */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm">
              <Button
                onClick={() => router.push("/user/message")}
                variant="ghost"
                className="p-2 md:hidden"
              >
                <ArrowLeft size={20} />
              </Button>
              <img
                src={
                  selectedUser?.profilePhoto ||
                  "https://via.placeholder.com/40x40.png?text=User"
                }
                alt={selectedUser?.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-800">
                  {selectedUser?.fullName}
                </h2>
                <p className="text-sm text-green-500">Available </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isMyMessage = String(msg.sender) === String(user?._id);

                  return (
                    <motion.div
                      key={msg._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                          isMyMessage
                            ? "bg-[#eb4c60] text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 mt-20">
                  No messages yet
                </p>
              )}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border-gray-200 focus-visible:ring-0"
              />
              <Button
                onClick={handleSend}
                className="bg-[#eb4c60] hover:bg-[#d94355] text-white rounded-full p-2"
              >
                <Send size={18} />
              </Button>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex flex-col justify-center items-center flex-1 text-center p-10 text-gray-500">
            <p>No chat selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
