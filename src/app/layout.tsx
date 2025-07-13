import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/components/Web3Provider";
import { GlobalHeader } from "@/components/GlobalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FanScan - PSG Jersey Scanner",
  description:
    "Scannez vos maillots PSG authentiques et participez aux concours",
  icons: {
    icon: "/fanscan_logo.png",
    apple: "/fanscan_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/fanscan_logo.png" />
        <link rel="apple-touch-icon" href="/fanscan_logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          <GlobalHeader />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
