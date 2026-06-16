import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://avero.pro"),
  
  title: "AVERO | Finanzas personales y empresariales",
  description:
    "AVERO une tus finanzas personales y empresariales en una plataforma moderna, clara y visual.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "AVERO | Finanzas personales y empresariales",
    description:
      "Controla tu dinero personal y de negocio desde una sola plataforma.",
    url: "https://www.avero.pro",
    siteName: "AVERO",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVERO | Finanzas personales y empresariales",
    description:
      "Finanzas personales y empresariales en una experiencia moderna, clara y visual.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
        <Analytics />
      </body>
    </html>
  );
}
