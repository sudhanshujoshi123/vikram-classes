import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Vikram Classes | Best Coaching for Class 11 & 12",
    template: "%s | Vikram Classes",
  },
  description:
    "Vikram Classes is the best coaching institute for Class 11 and 12 with expert teachers, concept clarity, and board exam preparation.",

  keywords: [
    "Vikram Classes",
    "Class 11 coaching",
    "Class 12 coaching",
    "Best teacher for class 11",
    "Best teacher for class 12",
    "Coaching institute",
  ],

  metadataBase: new URL("https://vikramclasses.com"),

  alternates: {
    canonical: "https://vikramclasses.com",
  },

  openGraph: {
    title: "Vikram Classes | Best Coaching for Class 11 & 12",
    description:
      "Join Vikram Classes for Class 11 & 12 coaching with experienced teachers and excellent results.",
    url: "https://vikramclasses.com",
    siteName: "Vikram Classes",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vikram Classes Coaching Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vikram Classes | Best Coaching for Class 11 & 12",
    description:
      "Best coaching institute for Class 11 and 12 with expert faculty.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
