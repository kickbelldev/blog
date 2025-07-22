import type { Metadata } from 'next'

import Footer from './_components/Footer'
import Header from './_components/Header'
import { notoSansKR } from './_fonts/notoSansKR'

import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Kayce Blog',
    default: 'Kayce Blog - Personal Records',
  },
  authors: [
    {
      name: 'Kayce Kim',
      url: 'https://github.com/kickbelldev',
    },
  ],
  creator: 'Kayce Kim',
  publisher: 'Kayce Kim',
  metadataBase: new URL('https://kickbelldev.github.com/blog'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://kickbelldev.github.com/blog',
    title: 'Kayce Blog - Personal Records',
    siteName: 'Kayce Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kayce Blog - Personal Records',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Kayce Blog RSS Feed"
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Kayce Blog Atom Feed"
          href="/atom.xml"
        />
      </head>
      <body className={`${notoSansKR.className} antialiased`}>
        <Header />
        <div className="min-h-screen flex flex-col pt-14">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
