import { Noto_Sans_KR } from 'next/font/google'

export const notoSansKR = Noto_Sans_KR({
  adjustFontFallback: true,
  display: 'swap',
  subsets: [
    'latin',
  ],
  weight: [
    '300',
    '600',
  ],
})
