import type { Metadata } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: SITE_CONFIG.name,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-[#09090B] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
