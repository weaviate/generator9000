
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

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
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_KEY ? process.env.GOOGLE_ANALYTICS_KEY : ""} />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
