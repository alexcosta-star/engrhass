"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
                >
                    {/* Animated Gradient Background */}
                    <motion.div
                        animate={{
                            background: [
                                "radial-gradient(circle at 20% 20%, #4ade80 0%, #a855f7 100%)",
                                "radial-gradient(circle at 80% 80%, #4ade80 0%, #a855f7 100%)",
                                "radial-gradient(circle at 20% 80%, #4ade80 0%, #a855f7 100%)",
                                "radial-gradient(circle at 80% 20%, #4ade80 0%, #a855f7 100%)",
                                "radial-gradient(circle at 20% 20%, #4ade80 0%, #a855f7 100%)",
                            ]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-20"
                    />

                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-24 h-24 mb-6 relative"
                        >
                            {/* Outer spinning ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-t-purple-600 border-r-transparent border-b-green-500 border-l-transparent rounded-full"
                            />
                            {/* Inner pulse */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-4 bg-gradient-to-tr from-green-400 to-purple-600 rounded-2xl shadow-lg"
                            />
                        </motion.div>

                        <motion.h2
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-purple-600 tracking-tighter"
                        >
                            MHT<span className="text-gray-900">.</span>ENGINEERING
                        </motion.h2>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-1 bg-gradient-to-r from-green-400 to-purple-600 rounded-full mt-4 w-48 overflow-hidden"
                        >
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full bg-white/30"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
