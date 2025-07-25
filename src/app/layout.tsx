// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext'; // ← AGREGAR

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InnoTech Solutions - Agentes IA Especializados",
  description: "Consultores expertos de IA para emprendedores y PyMEs",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
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