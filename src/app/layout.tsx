import type { Metadata } from 'next'

import Footer from './_components/Footer'
import Header from './_components/Header'
import { notoSansKR } from './_fonts/notoSansKR'

import './globals.css'

export const metadata: Metadata = {
  title: '[Site Title]',
  description: '[Site Description]',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-5">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
