import type { Metadata, Viewport } from "next";

import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "LifeShots",
  description: "个人照片记录与时间线",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "LifeShots",
    statusBarStyle: "default",
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f5ff",
};

const themeInitScript = `
(() => {
  try {
    const storageKey = "lifeshots-theme";
    const allow = ["purple", "sunset", "mint"];
    const saved = localStorage.getItem(storageKey);
    const theme = allow.includes(saved || "") ? saved : "purple";
    document.documentElement.setAttribute("data-theme", theme);
  } catch {
    document.documentElement.setAttribute("data-theme", "purple");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="purple">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
