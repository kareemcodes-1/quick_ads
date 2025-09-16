import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "./providers/toast-provider";
import AuthProvider from "./providers/provider";

export const metadata: Metadata = {
   title: "AI Product Ads Generator",
  description:
    "Create and manage AI agents that adapt to your business needs. Customize their roles, instructions, and appearance to deliver personalized, intelligent support across your workspace",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider />
        <AuthProvider>{children} </AuthProvider>
      </body>
    </html>
  );
}
