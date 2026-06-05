import '@/app/ui/global.css';
import { inter, playfairDisplay } from "@/app/ui/fonts";

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
