import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "استخدام کارآموز | پترو فولاد نیکان",
  description: "فرم ثبت‌نام و ارزیابی کارآموز بازرگانی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.0.0/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
      </head>
      <body className="font-sans bg-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
