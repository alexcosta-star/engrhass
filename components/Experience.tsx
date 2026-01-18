"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface Experience {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
}

export default function Experience() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "experience"));
                const data: Experience[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Experience);
                });

                if (data.length === 0) {
                    setExperiences([
                        {
                            id: "1",
                            role: "Social Media Executive",
                            company: "BAROSA Events & Marketing Company",
                            duration: "05/April/2022 - 20/Dec/2025",
                            description: "Planned and organized social media content, scheduled posts, managed campaigns, and coordinated with creative teams to ensure brand consistency.",
                        },
                        {
                            id: "2",
                            role: "Junior Site Incharge Engineer",
                            company: "M/S Super Highway Construction Company",
                            duration: "12 Months (Last 2 Semesters)",
                            description: "Assisted in site supervision, ensured work quality and safety compliance, coordinated with labor teams, and maintained daily progress reports.",
                        },
                        {
                            id: "3",
                            role: "Field Training Intern",
                            company: "Fine Homes & Co.",
                            duration: "July 2025 – Dec 2025",
                            description: "Gained hands-on experience in site operations, documentation, and field supervision. Developed skills in drawing interpretation and quality control.",
                        },
                        {
                            id: "4",
                            role: "Supervisor",
                            company: "Unilever, Pakistan",
                            duration: "Sep 2020 – Feb 2022",
                            description: "Oversaw daily operations, monitored staff performance, and trained teams to achieve production targets while maintaining quality.",
                        },
                    ]);
                } else {
                    setExperiences(data || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchExperience();
    }, []);

    if (loading) return null;

    return (
        <section id="experience" className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                        {/* Left Column: Heading */}
                        <div className="md:w-1/3">
                            <div className="sticky top-32">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6">
                                    <Briefcase className="w-4 h-4" />
                                    Journey
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                                    Professional <br />
                                    <span className="text-blue-600">Experience</span>
                                </h2>
                                <p className="mt-6 text-gray-600 leading-relaxed text-sm md:text-base">
                                    A chronological overview of my professional career, showcasing
                                    my progression and contributions in civil engineering.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Timeline */}
                        <div className="md:w-2/3">
                            <div className="relative space-y-12">
                                {/* Vertical Line */}
                                <div className="absolute left-[11px] top-2 bottom-5 w-px bg-gray-200"></div>

                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative pl-10"
                                    >
                                        {/* Dot on Timeline */}
                                        <div className="absolute left-0 top-2 w-[23px] h-[23px] bg-white border-2 border-blue-600 rounded-full z-10 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        </div>

                                        <div className="bg-white p-2 group transition-all duration-300">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {exp.role}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {exp.company}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                                    {exp.duration}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 py-1 italic text-sm md:text-base">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
