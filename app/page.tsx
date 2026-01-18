import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import About from "@/components/About";
import CV from "@/components/CV";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Certificates />
      <Experience />
      <About />
      <CV />
      <Footer />
    </main>
  );
}
