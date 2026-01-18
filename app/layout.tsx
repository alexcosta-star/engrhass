import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Muhammad Hassnain Tahir | Junior Civil Engineer",
  description: "Official portfolio of Muhammad Hassnain Tahir, a Junior Civil Engineer based in Dubai, experienced in site supervision, surveying, and infrastructure design.",
};

import LoadingScreen from "@/components/LoadingScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
