import type { Metadata } from "next";
import { Cormorant_Unicase } from "next/font/google";
import "./globals.css";

const font = Cormorant_Unicase({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--cormorant",
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
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
