import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/nav-bar";
import Footer from "@/components/layout/footer";
import { APP_NAME } from "@/lib/config";

const heading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: `${APP_NAME} | AI-powered commerce`,
  description: "A sharp, production-ready storefront backed by FastAPI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#0b1224] via-slate-950 to-black" />
        <div className="pointer-events-none fixed left-1/2 top-10 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <NavBar />
        <main className="mx-auto max-w-6xl px-6 py-10 lg:py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
