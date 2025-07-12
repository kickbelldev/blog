import type { Metadata } from 'next'

import { notoSansKR } from './_fonts/notoSansKR'

import './globals.css'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>{children}</body>
    </html>
  )
}
