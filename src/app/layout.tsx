import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Step AI Content Agent | Enterprise Multi-Agent Suite",
  description:
    "Production-grade AI multi-agent content generation platform with live research retrieval, factual claim verification, and tool-call logging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07080d] text-zinc-100 antialiased selection:bg-violet-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
