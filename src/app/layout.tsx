import type { Metadata } from "next";
import { Inter, Work_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Benario",
  description: "created for people from the people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen w-screen">
      <body
        className={`${inter.variable} ${workSans.variable} ${montserrat.variable} antialiased h-screen w-screen`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
