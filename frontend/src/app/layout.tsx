import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToLet.com — আপনার নতুন ঠিকানা, খুঁজে নিন সহজেই",
  description: "ঢাকায় বাসা খোঁজা ও ভাড়া দেওয়ার বিশ্বস্ত প্ল্যাটফর্ম। বনশ্রী, মিরপুর, উত্তরা, রামপুরা, মোহাম্মদপুর সহ সমগ্র ঢাকায় ফ্যামিলি, ব্যাচেলর ও সাবলেট বাসা খুঁজুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
