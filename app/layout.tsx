import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Galvan ai',
  description: 'Galvan ai website',
  generator: 'Next.js',
  icons: {
    icon: '/Galvan%20AI%20logo%20transparent.png',
    shortcut: '/Galvan%20AI%20logo%20transparent.png',
    apple: '/Galvan%20AI%20logo%20transparent.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
