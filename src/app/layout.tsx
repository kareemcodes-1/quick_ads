import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Lumina - AI Powered Image Editor",
  description: "Upload, transform, and optimize your images with AI-powered tools. Resize, crop, remove backgrounds, and more with AI transformations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
