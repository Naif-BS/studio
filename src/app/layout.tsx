
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext'; // Added import

export const metadata: Metadata = {
  title: 'MediaScope',
  description: 'Comprehensive Media Monitoring Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang and dir will be set by LanguageProvider
    <html>
      <body className="font-sans antialiased">
        <LanguageProvider> {/* Added LanguageProvider */}
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LanguageProvider> {/* Closed LanguageProvider */}
      </body>
    </html>
  );
}
