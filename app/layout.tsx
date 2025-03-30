import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZobieLeClimat",
  description: "ZobieLeClimat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ping.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
