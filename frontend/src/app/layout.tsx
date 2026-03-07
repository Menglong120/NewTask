import'./globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NSM Task Management System',
  description: 'Modern Task Management for NSM Tech',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/vendor/css/core.css" className="template-customizer-core-css" />
        <link rel="stylesheet" href="/vendor/css/theme-default.css" className="template-customizer-theme-css" />
        <link rel="stylesheet" href="/css/demo.css" />
        <link rel="stylesheet" href="/vendor/fonts/boxicons.css" />
        <link rel="stylesheet" href="/vendor/fontawesome-free-6.7.2-web/css/all.min.css" />
        <link rel="stylesheet" href="/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <script src="/vendor/js/helpers.js" async />
        <script src="/js/default_js/config.js" async />
      </head>
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
