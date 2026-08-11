import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "29sFormula",
  description: "A premium luxury perfume brand handcrafted by PhD students. Discover scientifically curated fragrances where scent is the difference you feel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..800&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=DM+Sans:opsz,wght@9..40,100..1000&family=Fraunces:opsz,wght@9..144,100..900&family=Inter:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Syne:wght@400..800&family=Unbounded:wght@200..900&family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var color = localStorage.getItem('settings_primaryColor');
                if (color) {
                  document.documentElement.style.setProperty('--primary-brand-color', color);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
