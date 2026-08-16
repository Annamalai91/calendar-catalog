import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@components/layout/navbar";
import Footer from "@components/layout/footer";
import FloatingContact from "@components/layout/floating-contact";
import CatalogueFlag from "@components/layout/catalogue-flag";
import { ThemeProvider } from "@components/theme-provider";
import { rootMetadata } from "@configs/metadata";
export { rootMetadata as metadata };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7FBF9] dark:bg-[#0A0A0C] text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingContact />
          <CatalogueFlag />
        </ThemeProvider>
      </body>
    </html>
  );
}
