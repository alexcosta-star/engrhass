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
        <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20">
            {/* Glassmorphic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px]"
                ></motion.div>
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[130px]"
                ></motion.div>

                {/* Engineering Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-6"
                        >
                            {data.title}
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onDoubleClick={handleNameDoubleClick}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 cursor-default select-none tracking-tight"
                            title="Double-click for admin"
                        >
                            {data.name}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
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
                                className="group relative px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl transition-all hover:bg-blue-700 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                Get In Touch
                                <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}> → </motion.span>
                            </a>
                            <a
                                href="#cv"
                                className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center"
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
                        <div className="relative group">
                            {/* Glassmorphic border effect */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100/40 to-white/40 rounded-[2.5rem] blur-sm -z-10 border border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Simple Elegant Glow */}
                            <div className="absolute inset-0 bg-blue-100/30 blur-3xl rounded-full opacity-60 transform scale-125"></div>

                            {/* Main Image Container */}
                            <div className="relative z-10 w-64 h-80 md:w-80 md:h-[480px] rounded-3xl overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] border-[10px] border-white/80 backdrop-blur-sm group-hover:border-white transition-all duration-500">
                                <img
                                    src={data.imageUrl}
                                    alt={data.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {/* Subtle Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 via-transparent to-transparent h-1/3"></div>
                            </div>


                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
