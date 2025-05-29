import Navbar from '@/components/navbar';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
            <nav>
                <Navbar/>
            </nav>
            {children}
        </div>
      </body>
    </html>
  );
}