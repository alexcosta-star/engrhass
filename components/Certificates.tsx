"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Award, X, ArrowLeft } from "lucide-react";

interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    imageUrl: string;
}

export default function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fullscreenCert, setFullscreenCert] = useState<Certificate | null>(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "certificates"));
                const data: Certificate[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Certificate);
                });

                if (data.length === 0) {
                    setCertificates([
                        { id: '1', title: 'Professional Engineer License', issuer: 'PEC', date: '2025', description: 'Licensed Professional Engineer.', imageUrl: 'https://res.cloudinary.com/dyq5zfd8x/image/upload/v1/sample' },
                        { id: '2', title: 'Structural Design Certificate', issuer: 'Engineering Council', date: '2024', description: 'Advanced structural analysis and design.', imageUrl: 'https://res.cloudinary.com/dyq5zfd8x/image/upload/v1/sample' },
                        { id: '3', title: 'AutoCAD Certified Professional', issuer: 'Autodesk', date: '2023', description: 'Expert-level proficiency in AutoCAD.', imageUrl: 'https://res.cloudinary.com/dyq5zfd8x/image/upload/v1/sample' },
                    ]);
                } else {
                    setCertificates(data);
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
    };

    const openFullscreen = (cert: Certificate) => {
        setFullscreenCert(cert);
        document.body.style.overflow = "hidden";
    };

    const closeFullscreen = () => {
        setFullscreenCert(null);
        document.body.style.overflow = "auto";
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeFullscreen();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    if (loading) return null;
    if (certificates.length === 0) return null;

    return (
        <>
            {/* Fullscreen Certificate View */}
            <AnimatePresence>
                {fullscreenCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <button
                                onClick={closeFullscreen}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Home
                            </button>
                            <div className="text-white text-center">
                                <h3 className="text-xl font-bold">{fullscreenCert.title}</h3>
                                <p className="text-white/60 text-sm">{fullscreenCert.issuer} • {fullscreenCert.date}</p>
                            </div>
                            <button
                                onClick={closeFullscreen}
                                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Certificate Image */}
                        <div className="flex-1 flex items-center justify-center p-8">
                            <motion.img
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={fullscreenCert.imageUrl}
                                alt={fullscreenCert.title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Description */}
                        <div className="p-6 border-t border-white/10 text-center">
                            <p className="text-white/80 max-w-2xl mx-auto">{fullscreenCert.description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Regular Section */}
            <section id="certificates" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 lg:px-20">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                            <Award className="w-4 h-4" />
                            Certificates
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Achievements & Certifications
                        </h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {/* Main Card */}
                        <div
                            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer group"
                            onClick={() => openFullscreen(certificates[currentIndex])}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col md:flex-row"
                                >
                                    {/* Text Content */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                        <span className="text-blue-600 text-sm font-medium uppercase tracking-wide">
                                            {certificates[currentIndex].issuer}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
                                            {certificates[currentIndex].title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {certificates[currentIndex].date}
                                        </p>
                                        <p className="text-gray-600 leading-relaxed">
                                            {certificates[currentIndex].description}
                                        </p>
                                        <p className="text-blue-600 text-sm mt-4 group-hover:underline">
                                            Click to view full certificate →
                                        </p>
                                    </div>

                                    {/* Image */}
                                    <div className="flex-1 bg-gray-100 relative overflow-hidden">
                                        <img
                                            src={certificates[currentIndex].imageUrl}
                                            alt={certificates[currentIndex].title}
                                            className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 px-4 py-2 rounded-lg">
                                                View Full
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="flex items-center gap-2">
                                {certificates.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full font-medium text-sm transition-all ${index === currentIndex
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
