export const metadata = {
  title: 'Bucket List Project',
  description: 'Created by Aaron Falk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
