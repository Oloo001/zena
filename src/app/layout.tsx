import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SessionProvider from "@/components/ui/SessionProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ui/theme-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "City Hire Ltd",
  description: "Premium car hire across Kenya",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
          <SessionProvider>
          <Navbar />
          <Toaster position="top-right" />
          {children}
          <Footer />
          <Analytics/>
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
