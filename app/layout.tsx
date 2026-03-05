import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TracklabX — F1 25 Setup Database & Race Calendar",
  description: "Community-driven F1 25 car setup database and 2025 F1 race calendar hub. Share setups, compare lap times, and track every race weekend.",
  openGraph: {
    title: "TracklabX — F1 25 Setup Database & Race Calendar",
    description: "Build the fastest setup. Own every lap.",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/assets/Logo/favicon/fav-b.svg', media: '(prefers-color-scheme: light)' },
      { url: '/assets/Logo/favicon/fav-w.svg', media: '(prefers-color-scheme: dark)' }
    ],
    shortcut: ['/assets/Logo/favicon/fav-b.svg'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
