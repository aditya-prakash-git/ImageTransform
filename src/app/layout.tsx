import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImageTransform",
  description: "Remove backgrounds & flip images instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold tracking-tight">
              ImageTransform
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Remove backgrounds &amp; flip images instantly
            </p>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <p className="text-xs text-muted-foreground text-center">
              Built with Next.js &bull; Remove.bg &bull; Cloudflare R2
            </p>
          </div>
        </footer>

        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
