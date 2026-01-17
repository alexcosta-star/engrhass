"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Briefcase, Award } from "lucide-react";

interface HeroData {
    name: string;
    title: string;
    description: string;
    imageUrl: string;
}

export default function Hero() {
    const [data, setData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "hero", "main");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data() as HeroData);
                } else {
                    setData({
                        name: "Muhammad Hassnain Tahir",
                        title: "Civil Engineer",
                        description: "Designing and building infrastructure that connects communities and shapes the future.",
                        imageUrl: "https://res.cloudinary.com/dyq5zfd8x/image/upload/v1/sample"
                    });
                }
            } catch (error) {
                console.error("Error fetching hero data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNameDoubleClick = () => {
        router.push("/admin");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pt-20">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <section className="min-h-screen flex items-center bg-white pt-20">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-blue-600 font-medium tracking-wide uppercase text-sm mb-4"
                        >
                            {data.title}
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onDoubleClick={handleNameDoubleClick}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 cursor-default select-none"
                            title="Double-click for admin"
                        >
                            {data.name}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8"
                        >
                            {data.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <a
                                href="#contact"
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Get In Touch
                            </a>
                            <a
                                href="#cv"
                                className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                View CV
                            </a>
                        </motion.div>
                    </div>

                    {/* Profile Image - Clean Professional Design */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-1 order-1 lg:order-2 flex justify-center"
                    >
                        <div className="relative">
                            {/* Simple Elegant Glow */}
                            <div className="absolute inset-0 bg-blue-50 blur-3xl rounded-full opacity-60 transform scale-110"></div>

                            {/* Main Image Container */}
                            <div className="relative z-10 w-64 h-80 md:w-80 md:h-[450px] rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-8 border-white group">
                                <img
                                    src={data.imageUrl}
                                    alt={data.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Subtle Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-1/4"></div>
                            </div>

                            {/* Minimal Decorative Frame */}
                            <div className="absolute -inset-4 border border-gray-100 rounded-[2rem] pointer-events-none -z-10"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
