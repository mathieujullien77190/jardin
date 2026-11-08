import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import AppProvider from '@/components/AppProvider';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Toasts from '@/components/Toasts';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Adopte un jardin',
  description:
    'Louez un jardin ou venez cueillir fruits et légumes chez des particuliers.',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => (
  <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
    <body className="flex min-h-full flex-col font-sans">
      <AppProvider>
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <Footer />
        <Toasts />
      </AppProvider>
    </body>
  </html>
);

export default RootLayout;
