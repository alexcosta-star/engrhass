"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FileText, ExternalLink, X, Download, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CVData {
    cvUrl: string;
    fileName: string;
}

export default function CV() {
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);

    useEffect(() => {
        const fetchCV = async () => {
            try {
                const docRef = doc(db, "cv", "main");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCvData(docSnap.data() as CVData);
                } else {
                    setCvData({
                        cvUrl: "#",
                        fileName: "CV_Muhammad_Hassnain_Tahir.pdf"
                    });
                }
            } catch (error) {
                console.error("Error fetching CV:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCV();
    }, []);

    const openCVInViewer = () => {
        if (cvData?.cvUrl && cvData.cvUrl !== "#") {
            setIsViewerOpen(true);
            setIframeLoading(true);
        }
    };

    if (loading) return null;

    // Use Google Docs viewer as it handles Cloudinary's raw URLs better than direct iframes in some browsers
    const viewerUrl = cvData?.cvUrl
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(cvData.cvUrl)}&embedded=true`
        : "";

    return (
        <section id="cv" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                        <FileText className="w-4 h-4" />
                        Resume
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        View My CV
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Get a comprehensive overview of my skills, experience, and qualifications as a Civil Engineer.
                    </p>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 inline-flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-gray-900 font-medium mb-2">
                            {cvData?.fileName || "Curriculum Vitae"}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            PDF Document
                        </p>
                        <a
                            href="https://wa.me/971562613896?text=Hi%20Hassnain%2C%20please%20send%20me%20your%20CV"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-green-600/20"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Request CV via WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Premium PDF Viewer Modal */}
            <AnimatePresence>
                {isViewerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">
                                            {cvData?.fileName || "Curriculum Vitae"}
                                        </h3>
                                        <p className="text-xs text-gray-500">Previewing Document</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={cvData?.cvUrl}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                        title="Download PDF"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    <button
                                        onClick={() => setIsViewerOpen(false)}
                                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-500"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Viewer Content */}
                            <div className="flex-1 bg-gray-100 relative">
                                {iframeLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                        <p className="text-gray-500 font-medium">Loading Document Viewer...</p>
                                    </div>
                                )}
                                <iframe
                                    src={viewerUrl}
                                    className="w-full h-full border-none"
                                    onLoad={() => setIframeLoading(false)}
                                    title="CV Viewer"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setIsViewerOpen(false)}
                                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
