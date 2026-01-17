"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FileText, ExternalLink } from "lucide-react";

interface CVData {
    cvUrl: string;
    fileName: string;
}

export default function CV() {
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);

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
            // Open PDF in new window with Google Docs viewer (or direct if browser supports)
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(cvData.cvUrl)}&embedded=true`;
            window.open(cvData.cvUrl, "_blank", "noopener,noreferrer");
        }
    };

    if (loading) return null;

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
                        <button
                            onClick={openCVInViewer}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                        >
                            <ExternalLink className="w-5 h-5" />
                            View CV
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
