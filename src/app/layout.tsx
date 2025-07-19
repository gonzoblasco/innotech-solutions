import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {AuthProvider} from '@/contexts/AuthContext'
import {siteConfig} from '@/lib/config' // ✅ AGREGAR ESTA LÍNEA
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name, // ✅ CAMBIAR ESTA LÍNEA
  description: siteConfig.description, // ✅ CAMBIAR ESTA LÍNEA
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <AuthProvider>
      {children}
    </AuthProvider>
    </body>
    </html>
  );
}