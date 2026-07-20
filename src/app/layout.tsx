import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ScrollVine from "@/components/ui/ScrollVine";

const clashDisplay = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});

const generalSans = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-general",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kautilya Yashovardhan - 3D Animator and Visual Artist",
  description:
    "Portfolio of Kautilya Yashovardhan, a 3D Animator and Visual Artist specializing in product visualization, environments, and motion graphics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${clashDisplay.variable} ${generalSans.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <LenisProvider>
          <CustomCursor />
          <ScrollProgress />
          <NoiseOverlay />
          <ScrollVine />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
