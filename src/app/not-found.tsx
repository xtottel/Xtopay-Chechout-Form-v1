"use client";
import { motion } from "framer-motion";


export default function NotFound() {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-[#f5f2ff] to-[#e0c9a4] dark:from-[#1a0933] dark:to-[#4d3b7d] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-[#130338] p-8 sm:p-12 rounded-2xl shadow-xl border border-[#e0c9a4] dark:border-[#4d3b7d]"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#4d3b7d] dark:text-[#e0c9a4] mb-6"
          >
            <span className="text-9xl font-bold block">404</span>
            <span className="text-2xl font-medium block mt-2">Page Not Found</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-[#4d3b7d] dark:text-[#e0c9a4] mb-8 max-w-lg mx-auto"
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}