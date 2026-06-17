import '@/app/ui/global.css';
import { inter, playfairDisplay } from "@/app/ui/fonts";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handcraft Haven',
  description: 'The official handcraft haven site.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
