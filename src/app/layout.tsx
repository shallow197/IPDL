import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import ChatWidget from "@/components/ChatWidget";
import NotificationContainer from "@/components/NotificationContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "UMMISCO | Portail Scientifique Institutionnel",
    template: "%s | UMMISCO UMI 209",
  },
  description:
    "Portail institutionnel d'UMMISCO (UMI 209, IRD & Sorbonne Université) — Unité Mixte Internationale de Modélisation Mathématique et Informatique des Systèmes Complexes. Publications référencées, datasets ouverts, simulations intégrées et 5 centres internationaux.",
  keywords: [
    "UMMISCO", "UMI 209", "IRD", "Sorbonne Université", "systèmes complexes",
    "modélisation multi-agents", "intelligence artificielle", "science citoyenne",
    "GAMA", "datasets", "Google Scholar",
  ],
  authors: [{ name: "UMMISCO UMI 209" }],
  openGraph: {
    title: "UMMISCO — Modéliser les systèmes complexes",
    description:
      "Unité Mixte Internationale (IRD & Sorbonne Université) en modélisation mathématique et informatique des systèmes complexes au service de la science de la durabilité.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
      style={{ scrollBehavior: "smooth" }}
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'light';if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
            <ChatWidget />
          </div>
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  );
}
