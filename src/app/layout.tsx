import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yordamchi",
  description: "AI-yordamchili shaxsiy maqsad-vazifa boshqaruv platformasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
