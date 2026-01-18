"use client";

import { motion } from "framer-motion";
import { GraduationCap, Code, Heart, CheckCircle2 } from "lucide-react";

export default function About() {
    const education = [
        {
            degree: "BS Civil Engineering",
            institution: "NFC Institute of Engineering & Technology, Multan",
            year: "2021 – 2025",
            details: "Recipient of MOFA need-based scholarship."
        },
        {
            degree: "Diploma of Associate Engineering (Civil)",
            institution: "Punjab Board of Technical Education, Lahore",
            year: "2018 – 2021",
            details: "Completed calligraphy and spoken English short courses."
        },
        {
            degree: "Matriculation",
            institution: "Punjab Board of Technical Education, Lahore",
            year: "Till 2018",
            details: "Initial education from kindergarten till 8th class."
        }
    ];

    const softSkills = ["Effective communication", "Active listening", "Willingness to learn", "Critical thinking", "Open-mindedness", "Adaptability", "Conflict resolution", "Negotiating", "Project management", "Time management", "Problem solving"];
    const technicalSkills = ["Site supervision", "Quantity take-offs", "BOQs preparation", "Construction drawing interpretation", "Surveying & leveling", "Contractor coordination", "Site reporting & documentation", "Quality & safety compliance", "AutoCAD (basic)", "MS Excel", "MS Word"];

    const interests = [
        { name: "Reading", detail: "Favorite book: 'Atomic Habits' by James Clear" },
        { name: "Traveling", detail: "Excited to visit Bali this summer" },
        { name: "Soccer", detail: "Big fan of Manchester United" },
        { name: "Coding", detail: "Love to design and create applications" }
    ];

    return (
        <section id="about" className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Education Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Education</h2>
                            </div>
                            <div className="space-y-8">
                                {education.map((item, index) => (
                                    <div key={index} className="relative pl-8 border-l-2 border-blue-100 hover:border-blue-600 transition-colors">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
                                        <h3 className="text-xl font-bold text-gray-900">{item.degree}</h3>
                                        <p className="text-blue-600 font-medium">{item.institution}</p>
                                        <p className="text-gray-500 text-sm mb-2">{item.year}</p>
                                        <p className="text-gray-600 leading-relaxed text-sm">{item.details}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Skills Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Code className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Technical Skills</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                                {technicalSkills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 group">
                                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{skill}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Soft Skills</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {softSkills.map((skill, index) => (
                                    <span key={index} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Interests Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-20 p-8 md:p-12 bg-gray-50 rounded-[2.5rem] border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-10 justify-center">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Heart className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Beyond Engineering</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {interests.map((interest, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-gray-900 mb-2">{interest.name}</h3>
                                    <p className="text-gray-500 text-sm">{interest.detail}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
