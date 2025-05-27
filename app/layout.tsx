import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import { ClerkProviderWrapper } from '@/components/layout/clerk-provider-wrapper'; // Import the new wrapper

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinTrack - Finance Management & Expense Tracker',
  description: 'Manage your finances, track expenses, and gain insights into your spending habits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProviderWrapper>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}