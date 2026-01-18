"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { Save, Plus, Trash2, Upload, Edit2, X, Check, Home, Award, Briefcase, FileText, Settings, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

// Types
interface HeroData {
    name: string;
    title: string;
    description: string;
    imageUrl: string;
}

interface Certificate {
    id?: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    imageUrl: string;
}

interface Experience {
    id?: string;
    role: string;
    company: string;
    duration: string;
    description: string;
}

interface CVData {
    cvUrl: string;
    fileName: string;
}

interface FooterData {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    about: string;
}

const DEFAULT_ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [activeTab, setActiveTab] = useState("hero");
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    // Data states
    const [hero, setHero] = useState<HeroData>({ name: "", title: "", description: "", imageUrl: "" });
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [cv, setCv] = useState<CVData>({ cvUrl: "", fileName: "" });
    const [footer, setFooter] = useState<FooterData>({
        email: "", phone: "", location: "", linkedin: "", about: ""
    });
    const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    // Edit states
    const [editingCert, setEditingCert] = useState<string | null>(null);
    const [editingExp, setEditingExp] = useState<string | null>(null);

    // No localStorage - ask for password every time

    const handleLogin = async () => {
        setLoading(true);
        try {
            const securityDoc = await getDoc(doc(db, "settings", "security"));
            const correctPassword = securityDoc.exists() ? securityDoc.data().password : DEFAULT_ADMIN_PASSWORD;

            if (password === correctPassword) {
                setIsAuthenticated(true);
                fetchAllData();
            } else {
                setPasswordError("Incorrect password");
            }
        } catch (error) {
            console.error("Login error:", error);
            setPasswordError("Connection error");
        } finally {
            setLoading(false);
        }
    };



    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Hero
            const heroDoc = await getDoc(doc(db, "hero", "main"));
            if (heroDoc.exists()) setHero(heroDoc.data() as HeroData);

            // Certificates
            const certsSnap = await getDocs(collection(db, "certificates"));
            const certs: Certificate[] = [];
            certsSnap.forEach((d) => certs.push({ id: d.id, ...d.data() } as Certificate));
            setCertificates(certs);

            // Experience
            const expSnap = await getDocs(collection(db, "experience"));
            const exps: Experience[] = [];
            expSnap.forEach((d) => exps.push({ id: d.id, ...d.data() } as Experience));
            setExperiences(exps);

            // CV
            const cvDoc = await getDoc(doc(db, "cv", "main"));
            if (cvDoc.exists()) setCv(cvDoc.data() as CVData);

            // Footer
            const footerDoc = await getDoc(doc(db, "footer", "main"));
            if (footerDoc.exists()) setFooter(footerDoc.data() as FooterData);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const showSaveStatus = (message: string) => {
        setSaveStatus(message);
        setTimeout(() => setSaveStatus(""), 3000);
    };

    // Save handlers
    const saveHero = async () => {
        try {
            await setDoc(doc(db, "hero", "main"), hero);
            showSaveStatus("Hero saved!");
        } catch (error) {
            console.error(error);
            showSaveStatus("Error saving hero");
        }
    };

    const saveFooter = async () => {
        try {
            await setDoc(doc(db, "footer", "main"), footer);
            showSaveStatus("Footer saved!");
        } catch (error) {
            console.error(error);
            showSaveStatus("Error saving footer");
        }
    };

    const saveCv = async () => {
        try {
            await setDoc(doc(db, "cv", "main"), cv);
            showSaveStatus("CV saved!");
        } catch (error) {
            console.error(error);
            showSaveStatus("Error saving CV");
        }
    };

    const saveSecurity = async () => {
        if (security.newPassword !== security.confirmPassword) {
            showSaveStatus("Passwords do not match!");
            return;
        }
        if (security.newPassword.length < 6) {
            showSaveStatus("Password too short (min 6 chars)");
            return;
        }

        try {
            await setDoc(doc(db, "settings", "security"), { password: security.newPassword });
            showSaveStatus("Password updated!");
            setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error(error);
            showSaveStatus("Error updating password");
        }
    };

    // Certificate CRUD
    const addCertificate = async () => {
        const newCert: Certificate = {
            title: "New Certificate",
            issuer: "Issuer",
            date: new Date().getFullYear().toString(),
            description: "Description",
            imageUrl: ""
        };
        try {
            const docRef = await addDoc(collection(db, "certificates"), newCert);
            setCertificates([...certificates, { ...newCert, id: docRef.id }]);
            setEditingCert(docRef.id);
        } catch (error) {
            console.error(error);
        }
    };

    const updateCertificate = async (cert: Certificate) => {
        if (!cert.id) return;
        try {
            const { id, ...data } = cert;
            await updateDoc(doc(db, "certificates", id), data);
            setEditingCert(null);
            showSaveStatus("Certificate updated!");
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCertificate = async (id: string) => {
        try {
            await deleteDoc(doc(db, "certificates", id));
            setCertificates(certificates.filter((c) => c.id !== id));
            showSaveStatus("Certificate deleted!");
        } catch (error) {
            console.error(error);
        }
    };

    // Experience CRUD
    const addExperience = async () => {
        const newExp: Experience = {
            role: "New Role",
            company: "Company",
            duration: "2024 - Present",
            description: "Description"
        };
        try {
            const docRef = await addDoc(collection(db, "experience"), newExp);
            setExperiences([...experiences, { ...newExp, id: docRef.id }]);
            setEditingExp(docRef.id);
        } catch (error) {
            console.error(error);
        }
    };

    const updateExperience = async (exp: Experience) => {
        if (!exp.id) return;
        try {
            const { id, ...data } = exp;
            await updateDoc(doc(db, "experience", id), data);
            setEditingExp(null);
            showSaveStatus("Experience updated!");
        } catch (error) {
            console.error(error);
        }
    };

    const deleteExperience = async (id: string) => {
        try {
            await deleteDoc(doc(db, "experience", id));
            setExperiences(experiences.filter((e) => e.id !== id));
            showSaveStatus("Experience deleted!");
        } catch (error) {
            console.error(error);
        }
    };

    // File upload
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (url: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            showSaveStatus("Uploading...");
            const result = await uploadToCloudinary(file, "image");
            setter(result.secure_url);
            showSaveStatus("Uploaded!");
        } catch (error) {
            console.error(error);
            showSaveStatus("Upload failed");
        }
    };

    const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            showSaveStatus("Uploading CV...");
            const result = await uploadToCloudinary(file, "raw");
            setCv({ cvUrl: result.secure_url, fileName: file.name });
            showSaveStatus("CV uploaded!");
        } catch (error) {
            console.error(error);
            showSaveStatus("Upload failed");
        }
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-4"
                    >
                        Login
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "hero", label: "Hero", icon: Home },
        { id: "certificates", label: "Certs", icon: Award },
        { id: "experience", label: "Exp", icon: Briefcase },
        { id: "footer", label: "Footer", icon: Settings },
        { id: "security", label: "Security", icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gray-100 overflow-x-hidden">
            {/* Save Status Toast */}
            {saveStatus && (
                <div className="fixed top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    {saveStatus}
                </div>
            )}

            {/* Mobile Header & Navigation */}
            <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                {/* Top Header with Home Link */}
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-semibold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">Admin</span>
                    </div>
                </div>

                {/* Grid Navigation */}
                <nav className="grid grid-cols-6 gap-1 p-2 bg-gray-50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[9px] font-semibold mt-1 uppercase tracking-tight truncate w-full text-center">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-xs text-gray-500">Manage your portfolio</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === tab.id
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors mt-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="lg:ml-64 p-3 md:p-6 min-h-screen">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Hero Editor */}
                        {activeTab === "hero" && (
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={hero.name}
                                            onChange={(e) => setHero({ ...hero, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={hero.title}
                                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={hero.description}
                                            onChange={(e) => setHero({ ...hero, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                        <div className="flex items-center gap-4">
                                            {hero.imageUrl && (
                                                <img src={hero.imageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                            )}
                                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                                                <Upload className="w-4 h-4" />
                                                Upload
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, (url) => setHero({ ...hero, imageUrl: url }))}
                                                    className="hidden"
                                                />
                                            </label>
                                            <input
                                                type="text"
                                                value={hero.imageUrl}
                                                onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                                                placeholder="Or paste URL"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={saveHero}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Hero
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Certificates Editor */}
                        {activeTab === "certificates" && (
                            <div className="max-w-4xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
                                    <button
                                        onClick={addCertificate}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Certificate
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {certificates.map((cert) => (
                                        <div key={cert.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                            {editingCert === cert.id ? (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={cert.title}
                                                        onChange={(e) => setCertificates(certificates.map((c) => c.id === cert.id ? { ...c, title: e.target.value } : c))}
                                                        placeholder="Title"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            value={cert.issuer}
                                                            onChange={(e) => setCertificates(certificates.map((c) => c.id === cert.id ? { ...c, issuer: e.target.value } : c))}
                                                            placeholder="Issuer"
                                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={cert.date}
                                                            onChange={(e) => setCertificates(certificates.map((c) => c.id === cert.id ? { ...c, date: e.target.value } : c))}
                                                            placeholder="Date"
                                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <textarea
                                                        value={cert.description}
                                                        onChange={(e) => setCertificates(certificates.map((c) => c.id === cert.id ? { ...c, description: e.target.value } : c))}
                                                        placeholder="Description"
                                                        rows={2}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                    />
                                                    <div className="flex items-center gap-4">
                                                        {cert.imageUrl && <img src={cert.imageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />}
                                                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                                                            <Upload className="w-4 h-4" /> Upload
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageUpload(e, (url) => setCertificates(certificates.map((c) => c.id === cert.id ? { ...c, imageUrl: url } : c)))}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cert.imageUrl}
                                                            onChange={(e) => setCertificates(certificates.map((c) => c.id === cert.id ? { ...c, imageUrl: e.target.value } : c))}
                                                            placeholder="Image URL"
                                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => updateCertificate(cert)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                                            <Check className="w-4 h-4" /> Save
                                                        </button>
                                                        <button onClick={() => setEditingCert(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">
                                                            <X className="w-4 h-4" /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {cert.imageUrl && <img src={cert.imageUrl} alt={cert.title} className="w-16 h-16 rounded-lg object-cover" />}
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                                                            <p className="text-sm text-gray-500">{cert.issuer} • {cert.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingCert(cert.id!)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                            <Edit2 className="w-4 h-4 text-gray-500" />
                                                        </button>
                                                        <button onClick={() => deleteCertificate(cert.id!)} className="p-2 hover:bg-red-50 rounded-lg">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experience Editor */}
                        {activeTab === "experience" && (
                            <div className="max-w-4xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                                    <button onClick={addExperience} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                        <Plus className="w-4 h-4" /> Add Experience
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {experiences.map((exp) => (
                                        <div key={exp.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                            {editingExp === exp.id ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input type="text" value={exp.role} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, role: e.target.value } : x))} placeholder="Role" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                                        <input type="text" value={exp.company} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x))} placeholder="Company" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                                    </div>
                                                    <input type="text" value={exp.duration} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, duration: e.target.value } : x))} placeholder="Duration" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                                    <textarea value={exp.description} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, description: e.target.value } : x))} placeholder="Description" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => updateExperience(exp)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                                            <Check className="w-4 h-4" /> Save
                                                        </button>
                                                        <button onClick={() => setEditingExp(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">
                                                            <X className="w-4 h-4" /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                                                        <p className="text-sm text-gray-500">{exp.company} • {exp.duration}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingExp(exp.id!)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                            <Edit2 className="w-4 h-4 text-gray-500" />
                                                        </button>
                                                        <button onClick={() => deleteExperience(exp.id!)} className="p-2 hover:bg-red-50 rounded-lg">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Footer Editor */}
                        {activeTab === "footer" && (
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Footer Settings</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                        <textarea value={footer.about} onChange={(e) => setFooter({ ...footer, about: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" value={footer.email} onChange={(e) => setFooter({ ...footer, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input type="text" value={footer.phone} onChange={(e) => setFooter({ ...footer, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" value={footer.location} onChange={(e) => setFooter({ ...footer, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                        <input type="text" value={footer.linkedin} onChange={(e) => setFooter({ ...footer, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <button onClick={saveFooter} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                        <Save className="w-4 h-4" />
                                        Save Footer
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Editor */}
                        {activeTab === "security" && (
                            <div className="max-w-md">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
                                    <p className="text-sm text-gray-500 mb-4">Update your admin panel access password.</p>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={security.newPassword}
                                            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={security.confirmPassword}
                                            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Repeat new password"
                                        />
                                    </div>
                                    <button
                                        onClick={saveSecurity}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
