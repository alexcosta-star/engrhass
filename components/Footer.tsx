"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

interface FooterData {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    about: string;
}

export default function Footer() {
    const [data, setData] = useState<FooterData | null>(null);

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const docRef = doc(db, "footer", "main");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data() as FooterData);
                } else {
                    setData({
                        email: "hassnain.3280@gmail.com",
                        phone: "+971 544679407",
                        location: "Al Nahda 2 - Dubai",
                        linkedin: "https://linkedin.com/in/muhammadhassnaintahir/",
                        about: "Junior Civil Engineer dedicated to high-quality construction, site supervision, and infrastructure development."
                    });
                }
            } catch (error) {
                console.error("Error fetching footer:", error);
            }
        };

        fetchFooter();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 lg:px-20 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            MHT<span className="text-blue-500">.</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            {data?.about || "Civil Engineer passionate about innovative infrastructure design."}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#certificates" className="text-gray-400 hover:text-white transition-colors">
                                    Certificates
                                </a>
                            </li>
                            <li>
                                <a href="#experience" className="text-gray-400 hover:text-white transition-colors">
                                    Experience
                                </a>
                            </li>
                            <li>
                                <a href="#cv" className="text-gray-400 hover:text-white transition-colors">
                                    View CV
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <span>{data?.email || "hassnain@example.com"}</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <span>{data?.phone || "+92 300 1234567"}</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <span>{data?.location || "Lahore, Pakistan"}</span>
                            </li>
                        </ul>

                        {/* LinkedIn Only */}
                        <div className="mt-6">
                            <a
                                href={data?.linkedin || "https://linkedin.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006396] rounded-lg transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 lg:px-20 py-6">
                    <p className="text-gray-500 text-sm text-center">
                        © {currentYear} Muhammad Hassnain Tahir. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
