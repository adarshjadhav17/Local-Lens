import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nearcast Local Discovery",
  description: "A mock local-area discovery dashboard for weather, traffic, events, dining, and deals."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
