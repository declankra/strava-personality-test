import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { OpenPanelProvider } from "@/lib/analytics/openpanel/OpenPanelProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export const metadata: Metadata = {
  title: "Create dkBuilds Next App",
  description: "dkbuilds next app starter-kit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <OpenPanelProvider />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
