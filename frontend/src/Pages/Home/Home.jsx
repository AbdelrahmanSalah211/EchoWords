import React from 'react'
import UserForm from "../../Components/UserForm/UserForm.jsx";
import { motion } from "framer-motion";
import { Outlet } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">

        <div className="flex flex-col justify-center items-start space-y-6">
          <h1 className="text-4xl font-bold leading-snug">
            Welcome to <span className="text-primary">EchoWords</span>
          </h1>
          <p className="text-lg text-gray-600">
            EchoWords is a blogging platform that allows you to share your thoughts and ideas with the world.
          </p>
          <p className="text-lg text-gray-600">
            Sign in or create an account to get started with your bloging.
          </p>
        </div>

        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="rounded-2xl p-6 bg-white"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
