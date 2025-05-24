import localFont from 'next/font/local'

export const notoSansMono = localFont({
  src: [
    {
      path: '../public/fonts/NotoSansMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/NotoSansMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/NotoSansMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans-mono',
})