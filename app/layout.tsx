import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScholarArth — Turning Eligibility into Success",
  description:
    "India's most intelligent scholarship platform. Discover 8,400+ scholarships, get AI-powered match scores, and manage your applications — all in one place. Free forever.",
  keywords:
    "scholarship India, OBC scholarship, SC ST scholarship, NSP scholarship, MahaDBT scholarship, merit scholarship, scholarship 2026, free scholarship India",
  openGraph: {
    title: "ScholarArth — Turning Eligibility into Success",
    description:
      "India's AI-powered scholarship discovery and application management platform for students from Class 9 to PhD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Viewport: prevent iOS auto-zoom on input focus */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
