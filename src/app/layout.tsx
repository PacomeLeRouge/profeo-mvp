import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { clutchFrFR } from "@/lib/clerk-localization";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Clutch MVP",
  description: "Trouvez un tuteur ou commencez à enseigner aujourd'hui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={clutchFrFR}>
      <html lang="fr">
        <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
