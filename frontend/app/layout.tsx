import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/nav-bar";
import Footer from "@/components/layout/footer";
import { APP_NAME } from "@/lib/config";
import { ToastProvider } from "@/components/ui/toast-provider";

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
  description: "A bright, fast storefront with live inventory and smooth checkout.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen text-slate-900 antialiased">
        <div className="pointer-events-none fixed left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/30 blur-[120px]" />
        <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,#fdfefe_0%,#f7f7fb_70%)]" />
        <ToastProvider>
          <NavBar />
          <main className="mx-auto max-w-6xl px-6 py-10 lg:py-12">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
