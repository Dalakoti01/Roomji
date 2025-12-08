"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "./Login";
import { RegisterForm } from "./Register";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* 🖼️ Background Image */}
      <Image
        src="/authBg.jpg"
        alt="Authentication background"
        fill
        priority
        className="absolute inset-0 object-cover object-center -z-10"
      />

      {/* Optional overlay to improve text readability */}
      {/* <div className="absolute inset-0 bg-white/60 backdrop-blur-sm -z-10" /> */}

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/30">
        {/* Tabs */}
        <div className="flex relative border-b">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 cursor-pointer py-4 text-center font-medium text-sm transition-colors duration-200 ${
              isLogin ? "text-[#EB4C60]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 cursor-pointer py-4 text-center font-medium text-sm transition-colors duration-200 ${
              !isLogin ? "text-[#EB4C60]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Create Account
          </button>

          <motion.div
            className="absolute bottom-0 h-0.5 bg-[#EB4C60] w-1/2"
            initial={false}
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              duration: 0.2,
            }}
          />
        </div>

        {/* Form Animation */}
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  duration: 0.2,
                }}
                className="w-full"
              >
                <LoginForm onToggle={toggleForm} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  duration: 0.2,
                }}
                className="w-full"
              >
                <RegisterForm onToggle={toggleForm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🌸 Decorative bar */}
      <div className="absolute bottom-6 flex justify-center w-full">
        <motion.div
          className="w-24 h-1.5 rounded-full bg-[#EB4C60]/20 backdrop-blur-sm"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
        />
      </div>
    </section>
  );
}
