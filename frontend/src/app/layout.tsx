import Navigation from '../components/Navigation';
import '../styles/globals.css';

export const metadata = {
  title: 'Library Management System',
  description: 'Library management frontend built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navigation />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
