import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generator9000",
  description: "Generate synthetic data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="light" lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
