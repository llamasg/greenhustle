import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Hustle Festival 2026 · Saturday 30 May · Nottingham",
  description:
    "A free one-day festival of music, makers, food and ideas across three sites in Nottingham city centre. Saturday 30 May 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
