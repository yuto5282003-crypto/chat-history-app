import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import SplashScreen from "@/components/shared/SplashScreen";
import "./globals.css";


export const metadata: Metadata = {
  title: "SLOTY — 時間共有マーケット",
  description: "「人」ではなく「時間枠」を売買・共有するアプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* DNS prefetch & preconnect for faster 3D model loading */}
        <link rel="dns-prefetch" href="https://drive.usercontent.google.com" />
        <link rel="preconnect" href="https://drive.usercontent.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SplashScreen>
            {children}
          </SplashScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
