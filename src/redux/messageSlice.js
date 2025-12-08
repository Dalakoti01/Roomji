import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    chattingUsers: [],
    currentChat : null
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setChattingUser: (state, action) => {
      const newUser = action.payload;

      // ✅ If you’re setting multiple users (array from backend)
      if (Array.isArray(newUser)) {
        // Merge unique users
        const existingIds = state.chattingUsers.map((u) => u._id?.toString());
        const merged = [
          ...state.chattingUsers,
          ...newUser.filter((u) => !existingIds.includes(u._id?.toString())),
        ];
        state.chattingUsers = merged;
      } else if (newUser && newUser._id) {
        // ✅ If it’s a single user (e.g. property owner)
        const exists = state.chattingUsers.some(
          (u) => u._id?.toString() === newUser._id?.toString()
        );
        if (!exists) state.chattingUsers.push(newUser);
      }
    },
    setCurrentChat : (state,action) => {
      state.currentChat  = action.payload
    }
  },
});

export const { setMessages, setChattingUser,setCurrentChat } = messageSlice.actions;
export default messageSlice.reducer;
