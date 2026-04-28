import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Lens",
  description: "A local discovery dashboard for weather, traffic, events, dining, and deals."
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
