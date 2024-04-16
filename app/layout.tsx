import type { Metadata } from "next";
import { Cormorant_Unicase, Cormorant } from "next/font/google";
import "./css.css";

const cormorant = Cormorant({
  weight: "300",
  subsets: ["latin"],
  variable: "--cormorant",
});

const cormorant_unicase = Cormorant_Unicase({
  weight: ["300", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElleLM",
  description: "Elle Fiorentino-Lange's personal website",
};

// Mute logs in PROD
if (process.env.NODE_ENV === "production") console.log = () => {};

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
      <body className="w-full h-full">{children}</body>
    </html>
  );
}
