import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
})

export const metadata: Metadata = {
  title: "UI Builder",
  description: "Generate UI Components with a single prompt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="max-w-[1201px] mx-auto">
            <Navbar />
            {children}
            <Toaster />
          </div>
        </ThemeProvider >
        </body>
      </html>
    </ClerkProvider>
  );
}
