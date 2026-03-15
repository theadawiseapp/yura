import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yura — Send & Request Gifts",
  description:
    "Discover, send, and request the perfect gifts. A social gifting platform launching in Tamale, Ghana.",
  icons: {
    icon: "/assets/yura-logo.png",
    apple: "/assets/yura-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSerif.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
