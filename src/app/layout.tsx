import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "ilovelinkedin — LinkedIn Portfolio Generator",
  description: "Transform your LinkedIn profile into a stunning portfolio page in minutes. Choose from premium themes and get a professional online presence.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23C8963E'/><text y='.9em' x='50%' text-anchor='middle' font-size='65' fill='white'>in</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <CustomCursor />
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
