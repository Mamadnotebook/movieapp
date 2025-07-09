import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cinema Discover - Discover Movies & TV Shows',
  description: 'Professional movie discovery website. Browse popular, trending, top-rated movies and TV shows. Get detailed information, watch trailers, and discover your next favorite film.',
  keywords: [
    'movies',
    'cinema',
    'film',
    'tv shows',
    'entertainment',
    'tmdb',
    'movie database',
    'trailers',
    'reviews',
    'popular movies',
    'trending movies'
  ],
  authors: [{ name: 'Cinema Discover Team' }],
  creator: 'Cinema Discover',
  publisher: 'Cinema Discover',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cinema-discover.com',
    title: 'Cinema Discover - Discover Movies & TV Shows',
    description: 'Professional movie discovery website. Browse and discover movies and TV shows.',
    siteName: 'Cinema Discover',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cinema Discover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cinema Discover - Discover Movies & TV Shows',
    description: 'Professional movie discovery website. Browse and discover movies and TV shows.',
    images: ['/og-image.jpg'],
    creator: '@cinemadiscover',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'entertainment',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #475569',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}