import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PolicyPal - Generate Legal Policies in Minutes",
  description: "Generate GDPR & CCPA compliant privacy policies, terms of service, EULAs, and cookie policies with AI. Auto-updates when laws change.",
  keywords: ["privacy policy generator", "terms of service", "GDPR", "CCPA", "legal documents", "compliance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
