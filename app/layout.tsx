import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScholarArth — Turning Eligibility into Success",
  description:
    "India's most intelligent scholarship platform. Discover 8,400+ scholarships, get AI-powered match scores, and manage your applications — all in one place. Free forever.",
  keywords:
    "scholarship India, OBC scholarship, SC ST scholarship, NSP scholarship, merit scholarship, scholarship 2025",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
