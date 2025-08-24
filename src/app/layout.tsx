import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ikigai Journal - Professional Trading Journal",
  description: "Advanced trading journal with analytics, risk management, and portfolio tracking for serious traders.",
  keywords: ["trading journal", "portfolio management", "trading analytics", "risk management", "ikigai"],
  authors: [{ name: "ikigai Journal Team" }],
  openGraph: {
    title: "ikigai Journal - Professional Trading Journal",
    description: "Advanced trading journal with analytics, risk management, and portfolio tracking for serious traders.",
    url: "https://ikigai-journal.com",
    siteName: "ikigai Journal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ikigai Journal - Professional Trading Journal",
    description: "Advanced trading journal with analytics, risk management, and portfolio tracking for serious traders.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
