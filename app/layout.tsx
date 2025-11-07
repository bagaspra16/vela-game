import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "VELA - Fortune Sails Here",
  description: "Experience the future of blockchain gaming with stunning 3D visuals and innovative gameplay. Fortune sails here at VELA.",
  icons: {
    icon: '/vela-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
