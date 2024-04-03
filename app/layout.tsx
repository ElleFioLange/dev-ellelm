import type { Metadata } from "next";
import { Cormorant_Unicase, Cormorant } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  weight: "300",
  subsets: ["latin"],
  variable: "--cormorant",
});

const cormorant_unicase = Cormorant_Unicase({
  weight: "300",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElleLM",
  description: "Elle Fiorentino-Lange's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${cormorant_unicase.className} ${cormorant.variable}`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
